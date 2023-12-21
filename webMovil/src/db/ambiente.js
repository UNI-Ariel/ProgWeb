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

    async add_facilities_to_ambient(id_ambiente, facilidades){
        const values = Array.isArray(facilidades) ? facilidades : [facilidades];
        let additions = 0;
        for(const v of values){
            const res = await this.add_facility_to_ambient(id_ambiente, this.facilidades[v]);
            if(res){
                additions++;
            }
            else{
                console.log('Error while adding facilidad to ambiente:', id_ambiente, this.facilidades[v]);
            }
        }
        return additions === values.length;
    }

    async remove_facility_from_ambient(id_ambiente, id_facilidad){
        const sql = 'DELETE FROM facilidades WHERE id_ambiente=? AND id_facilidad=?';
        const res = await db.query(sql, [id_ambiente, id_facilidad ]);
        return res;
    }

    async remove_facilities_from_ambient(id_ambiente, facilidades){
        const values = Array.isArray(facilidades) ? facilidades : [facilidades];
        let deletions = 0;
        for(const v of values){
            const res = await this.remove_facility_from_ambient(id_ambiente, this.facilidades[v]);
            if(res){
                deletions++;
            }
            else{
                console.log('Error while removing facilidad from ambiente:', id_ambiente, this.facilidades[v]);
            }
        }
        return deletions === values.length;
    }

    async update(current_ambient, new_data){
        const sql = 'UPDATE ambiente SET nombre=?, id_tipo=?, capacidad=?, ubicacion=?, descripcion=? ' + 
                        'WHERE ambiente.id=?';
        const values = [new_data.nombre, this.tipos[new_data.tipo], new_data.capacidad, new_data.ubicacion, new_data.descripcion, current_ambient.id];
        const res = await db.query(sql, values);
        if(res){            
            if(new_data.facilidades && ! current_ambient.facilidades){
                return await this.add_facilities_to_ambient(current_ambient.id, new_data.facilidades);
            }
            else if( ! new_data.facilidades && current_ambient.facilidades){
                return await this.remove_facilities_from_ambient(current_ambient.id, current_ambient.facilidades.split(','));
            }
            else{
                const current_facilities = current_ambient.facilidades.split(',');
                const updated_facilities = Array.isArray(new_data.facilidades) ? new_data.facilidades : [new_data.facilidades];
                const add_array = [];
                const del_array = [];
                current_facilities.forEach(f =>{
                    if( ! updated_facilities.includes(f)){
                        del_array.push(f);
                    }
                });
                updated_facilities.forEach(f =>{
                    if( ! current_facilities.includes(f)){
                        add_array.push(f);
                    }
                });
                return await this.add_facilities_to_ambient(current_ambient.id, add_array) && 
                        await this.remove_facilities_from_ambient(current_ambient.id, del_array);
            }
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
        const sql = 'SELECT a.nombre, t.nombre AS tipo, a.ubicacion, a.descripcion, a.capacidad, i.facilidades ' + 
                        'FROM ambiente a LEFT JOIN tipo t on t.id=a.id_tipo LEFT JOIN ( ' +
                        'SELECT fds.id_ambiente, GROUP_CONCAT(f.nombre) facilidades ' +
                        'FROM facilidades fds LEFT JOIN facilidad f on f.id=fds.id_facilidad GROUP BY fds.id_ambiente) ' +
                        'AS i on i.id_ambiente=a.id WHERE a.activo="si" AND a.deshabilitado="no" LIMIT ? OFFSET ?';
        const data = await db.query(sql, [perPage, offset]);
        return data;
    }

    async get_bookables(filters){
        const page = 'page' in filters ? filters.page : this.page;
        const perPage = 'perPage' in filters ? filters.perPage : this.perPage;
        const offset = (page - 1) * perPage;
        const values = [];
        let sql = 'SELECT a.nombre, a.capacidad, a.ubicacion ' +
                    'FROM ambiente a LEFT JOIN facilidades fd on fd.id_ambiente=a.id ' +
                    'LEFT JOIN facilidad f on f.id=fd.id_facilidad ' +
                    'WHERE a.activo="si" AND a.deshabilitado="no" ';
        if('capacidad' in filters){
            sql += 'AND a.capacidad>=? ';
            values.push(filters.capacidad);
        }
        if('tipo' in filters){
            sql += 'AND a.id_tipo=? ';
            values.push(this.tipos[filters.tipo]);
        }
        sql += 'AND NOT EXISTS( SELECT 1 FROM reservas as r ' +
                'WHERE r.id_ambiente = a.id AND r.fecha_reserva=? ' +
                'AND r.id_periodo=? AND r.id_estado !="3") ';
        values.push(filters.fecha, filters.horario);
        if('facilidades' in filters){
            const fds = Array.isArray(filters.facilidades) ? filters.facilidades : [filters.facilidades];
            sql += 'AND f.nombre IN (' + fds.map(e => '"' + e + '"').toString()  + ') ';
            sql += 'GROUP BY a.id HAVING COUNT(DISTINCT f.id) = ? ';
            values.push(fds.length);
        }
        else{
            sql += 'GROUP BY a.id ';
        }
        sql += 'LIMIT ? OFFSET ?';
        values.push(perPage, offset);
        const data = await db.query(sql, values);
        return data;
    }

    async book(ambient, params){
        console.log(ambient, params);
        let sql = 'SELECT * FROM reservas WHERE id_ambiente=? AND id_periodo=? AND id_estado !=?';
        let values = [ambient.id, params.horario, 3];
        const conflict = await db.query(sql, values);
        if(conflict.length){
            return false;
        }
        else{
            sql = 'INSERT INTO reservas (id_ambiente, id_periodo, id_estado, id_usuario, fecha_reserva) VALUES (?,?,?,?,?)';
            values = [ambient.id, params.horario, 2, params.uid, params.fecha];
            const result = await db.query(sql, values);
            if(result && result.affectedRows){
                return true;
            }
            else{
                return false;
            }
        }
    }

    async find(name){
        const sql = 'SELECT a.id, a.nombre, t.nombre AS tipo, a.ubicacion, a.descripcion, a.capacidad, i.facilidades ' +
                        'FROM ambiente a LEFT JOIN tipo t on t.id=a.id_tipo LEFT JOIN ( ' +
                        'SELECT fds.id_ambiente, GROUP_CONCAT(f.nombre) facilidades ' +
                        'FROM facilidades fds LEFT JOIN facilidad f on f.id=fds.id_facilidad GROUP BY fds.id_ambiente) ' +
                        'AS i on i.id_ambiente=a.id WHERE a.nombre = ? AND a.activo="si" AND a.deshabilitado="no"';
        const data = await db.query(sql, [name]);
        return data;
    }

    async get_pending_bookings(filters){
        const page = 'page' in filters ? filters.page : this.page;
        const perPage = 'perPage' in filters ? filters.perPage : this.perPage;
        const offset = (page - 1) * perPage;
        const sql = 'SELECT r.id reserva, DATE_FORMAT(r.fecha_reserva, "%Y-%m-%d") fecha, a.nombre, t.nombre tipo, a.capacidad FROM ambiente a ' +
                         'LEFT JOIN reservas r on a.id=r.id_ambiente LEFT JOIN tipo t on t.id=a.id_tipo ' +
                         'WHERE r.id_estado=? ORDER BY r.fecha_agregado LIMIT ? OFFSET ?';
        const values = [this.estados.Pendiente, perPage, offset];
        const data = await db.query(sql, values);
        return data;
    }

    async get_booking(id_reserva){
        const sql = 'SELECT * FROM reservas where id=?';
        const data = await db.query(sql, [id_reserva]);
        return data;
    }

    async get_booking_history(id_usuario, filters){
        const page = 'page' in filters ? filters.page : this.page;
        const perPage = 'perPage' in filters ? filters.perPage : this.perPage;
        const offset = (page - 1) * perPage;
        const values = [];
        let sql = 'SELECT a.nombre, t.nombre tipo, a.capacidad, a.ubicacion, DATE_FORMAT(r.fecha_reserva, "%Y-%m-%d") fecha, e.nombre estado, r.id reserva ' +
                    'FROM ambiente a LEFT JOIN reservas r on r.id_ambiente=a.id LEFT JOIN tipo t on t.id=a.id_tipo LEFT JOIN estado e on e.id=r.id_estado ' + 
                    'WHERE r.id_usuario=? ';
        values.push(id_usuario);
        if('fecha' in filters){
            sql += 'AND r.fecha_reserva=? ';
            values.push(filters.fecha);
        }
        sql += 'ORDER BY r.fecha_agregado LIMIT ? OFFSET ?';
        values.push(perPage, offset);
        const data = await db.query(sql, values);
        return data;
    }

    async get_bookings_history(filters){
        const page = 'page' in filters ? filters.page : this.page;
        const perPage = 'perPage' in filters ? filters.perPage : this.perPage;
        const offset = (page - 1) * perPage;
        const values = [];
        let sql = 'SELECT u.nombre usuario, a.nombre, DATE_FORMAT(r.fecha_reserva, "%Y-%m-%d") fecha, e.nombre estado ' + 
                    'FROM ambiente a LEFT JOIN reservas r on r.id_ambiente=a.id LEFT JOIN estado e on e.id=r.id_estado ' +
                    'LEFT JOIN usuarios u on u.id=r.id_usuario WHERE r.id_estado !=? ';
        values.push(this.estados.Pendiente);
        if('fecha' in filters){
            sql += 'AND r.fecha_reserva=? ';
            values.push(filters.fecha);
        }
        sql += 'ORDER BY r.fecha_agregado LIMIT ? OFFSET ?';
        values.push(perPage, offset);
        const data = await db.query(sql, values);
        return data;
    }

    async update_pending_booking(id_reserva, action){
         const sql = 'UPDATE reservas SET id_estado=? WHERE id=?';
         const action_value = action.action === 'accept' ? this.estados.Aceptado : this.estados.Rechazado;
         const values = [action_value, id_reserva];
         const data = await db.query(sql, values);
         if(data && data.affectedRows){
            return true;
         }
         else{
            return false;
         }
    }
    
    async delete(id_ambiente){
        const sql = 'UPDATE ambiente SET deshabilitado="si" WHERE id = ?';
        const data = await db.query(sql, [id_ambiente]);
        return data;
    }
}

module.exports = new Ambiente();