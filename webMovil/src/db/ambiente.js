const db = require('./database');
class Ambiente{
    constructor(){
        this.page = 1;
        this.perPage = 10;
        this.tipos = {};
        this.estados = {};
        this.facilidades = {};
        this.periodos = {};
    }

    get_tipos(){
        return this.tipos;
    }

    get_estados(){
        return this.estados;
    }

    get_facilidades(){
        return this.facilidades;
    }

    get_periodos(){
        return this.periodos;
    }

    get_properties(){
        const info = {tipos:[], facilidades: [], periodos: []};
        for( var k in this.tipos){
            info.tipos.push(k);
        }
        for( var k in this.facilidades){
            info.facilidades.push(k);
        }
        for( var k in this.periodos){
            const p = this.periodos[k];
            p.periodo = k;
            info.periodos.push(p);
        }
        return info;
    }

    async init_properties(){
        const tipos = await db.query('SELECT id, nombre FROM tipo');
        tipos.forEach(tipo =>{
            this.tipos[tipo.nombre] = tipo.id;
        });
        const estados = await db.query('SELECT id, nombre FROM estado');
        estados.forEach(estado =>{
            this.estados[estado.nombre] = estado.id;
        });
        const facilidades = await db.query('SELECT id, nombre FROM facilidad');
        facilidades.forEach(facilidad =>{
            this.facilidades[facilidad.nombre] = facilidad.id;
        });
        const periodos = await db.query('SELECT id, TIME_FORMAT(inicia, "%H:%i") AS inicia, TIME_FORMAT(termina, "%H:%i") AS termina FROM periodos');
        periodos.forEach(periodo =>{
            this.periodos[periodo.id] = {"inicia": periodo.inicia, "termina": periodo.termina};
        });
    }

    async update_tipos(){
        const sql = 'SELECT nombre, id FROM tipo';
        const data = await db.query(sql);
        data.forEach(value =>{
            if(! this.tipos[value.nombre])
                this.tipos[value.nombre] = value.id;
        });
    }

    async search_available(query){
        const values = [query.fecha, query.horario, query.capacidad];
        const sql = 'SELECT a.nombre, a.ubicacion, a.capacidad FROM ambiente AS a ' +
                            'WHERE NOT EXISTS( SELECT 1 FROM reservas as r ' +
                                'WHERE r.id_ambiente = a.id AND r.fecha_reserva=? ' +
                                'AND r.id_periodo=? AND r.id_estado="1") ' +
                            'AND a.capacidad >=? AND a.deshabilitado="no" AND a.activo="si" ORDER BY a.capacidad LIMIT 5';
        const data = await db.query(sql, values);
        return data;
    }

    async add_new(data){
        const values = [data.nombre, this.tipos[data.tipo], data.ubicacion, data.descripcion, data.capacidad];
        const sql = 'INSERT INTO ambiente(nombre, id_tipo, ubicacion, descripcion, capacidad, deshabilitado, activo)' +
                         'VALUES(?, ?, ?, ?, ?, "no", "si")';
        const res = await db.query(sql, values);
        if(res && data.facilidades){
            return await this.add_facilities_to_ambient(res.insertId, data.facilidades);
        }
        else{
            return res;
        }
    }

    async add_facility_to_ambient(id_ambiente, id_facilidad){
        const sql = 'INSERT INTO facilidades (id_ambiente, id_facilidad) VALUES (?, ?)';
        const res = await db.query(sql, [id_ambiente, id_facilidad ]);
        return res;
    }

    async add_facilities_to_ambient(ambient_id, facilities){
        const values = Array.isArray(facilities) ? facilities : [facilities];
        let additions = 0;
        for(const v of values){
            const res = await this.add_facility_to_ambient(ambient_id, this.facilidades[v]);
            if(res){
                additions++;
            }
        }
        return additions === values.length;
    }

    async remove_facility_from_ambient(id_ambiente, id_facilidad){
        const sql = 'DELETE FROM facilidades WHERE id_ambiente=? AND id_facilidad=?';
        const res = await db.query(sql, [id_ambiente, id_facilidad ]);
        return res;
    }

    async remove_facilities_from_ambient(ambient_id, facilities){
        const values = Array.isArray(facilities) ? facilities : [facilities];
        let deletions = 0;
        for(const v of values){
            const res = await this.remove_facility_from_ambient(ambient_id, this.facilidades[v]);
            if(res){
                deletions++;
            }
        }
        return deletions === values.length;
    }

    async get_ambient_id(name){
        const sql = 'Select id FROM ambiente WHERE nombre=?';
        const res = db.query(sql, [name]);
        return res;
    }

    async update_ambient(curr_data, new_data){
        const sql = 'UPDATE ambiente SET nombre=?, id_tipo=?, capacidad=?, ubicacion=?, descripcion=? ' + 
                        'WHERE ambiente.nombre=?';
        const values = [new_data.nombre, this.tipos[new_data.tipo], new_data.capacidad, new_data.ubicacion, new_data.descripcion, curr_data.nombre];
        const res = await db.query(sql, values);
        const id = (await this.get_ambient_id(curr_data.nombre))[0];
        if(new_data.facilidades){
            if( ! curr_data.facilidades){
                this.add_facilities_to_ambient(id.id, new_data.facilidades);
            }
            else{
                console.log('Should update, add, remove facilidades');
            }
        }
        if( ! new_data.facilidades && curr_data.facilidades){
            this.remove_facilities_from_ambient(id.id, curr_data.facilidades.split(','));
        }
        return res;
    }

    async count(){
        const sql = 'SELECT COUNT(*) AS count FROM ambiente';
        const count = await db.query(sql);
        return count;
    }

    async get_all(filters){
        const page = 'page' in filters ? filters.page : this.page;
        const perPage = 'perPage' in filters ? filters.perPage : this.perPage;
        const offset = (page - 1) * perPage;
        const sql = 'SELECT a.nombre, t.nombre AS tipo, a.ubicacion, a.descripcion, a.capacidad ' + 
                        'FROM ambiente AS a LEFT JOIN tipo AS t on t.id=a.id_tipo ' + 
                        'WHERE activo = "si" LIMIT ? OFFSET ?';
        const data = await db.query(sql, [perPage, offset]);
        return data;
    }

    async find(name){
        const sql = 'SELECT a.nombre, t.nombre AS tipo, a.ubicacion, a.descripcion, a.capacidad, i.facilidades ' +
                        'FROM ambiente a LEFT JOIN tipo t on t.id=a.id_tipo LEFT JOIN ( ' +
                        'SELECT fds.id_ambiente, GROUP_CONCAT(f.nombre) facilidades ' +
                        'FROM facilidades fds LEFT JOIN facilidad f on f.id=fds.id_facilidad GROUP BY fds.id_ambiente) ' +
                        'AS i on i.id_ambiente=a.id WHERE a.nombre = ? AND a.activo="si" AND a.deshabilitado="no"';
        const data = await db.query(sql, [name]);
        return data;
    }

    async get_pending(filters){
        const page = 'page' in filters ? filters.page : this.page;
        const perPage = 'perPage' in filters ? filters.perPage : this.perPage;
        const offset = (page - 1) * perPage;
        const sql = 'SELECT * FROM ambiente AS a LEFT JOIN reservas AS r on a.id_ambiente=r.id_ambiente ' +
                         'WHERE r.id_estado=' + this.estados.pendiente +
                         ' LIMIT ? OFFSET ?';
        const data = await db.query(sql, [perPage, offset]);
        return data;
    }
    
    async delete(name){
        const sql = 'UPDATE ambiente SET activo = no WHERE nombre = ?';
        const data = await db.query(sql, [name]);
        return data;
    }
}

module.exports = new Ambiente();