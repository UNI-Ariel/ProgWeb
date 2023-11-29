const db = require('./database');
const { valid_text, numeric } = require('../utils/tools');

class Ambiente{
    constructor(){
        this.page = 1;
        this.perPage = 10;
        this.tipos = {"Auditorio": 1, "Aula": 2, "Biblioteca": 3, "Comedor": 4};
        this.estados = {"Aceptado": 1, "Pendiente": 2, "Rechazado": 3};
        this.facilidades = {"Data Display": 1, "Televisión": 2};
    }

    get_data(data){
        if(! 'nombre' in data || ! 'tipo' in data || ! 'ubicacion' in data || ! 'descripcion' in data || ! 'capacidad' in data){
            return [];
        }
        const tipo = data.tipo;
        const nombre = data.nombre;
        const ubicacion = data.ubicacion;
        const descripcion = data.descripcion;
        const capacidad = data.capacidad;
        if(! valid_text(nombre) || ! valid_text(tipo) || ! ubicacion || ! numeric(capacidad)){
            return [];
        }
        if ( ! this.tipos[tipo] ){
            return [];
        }
        return [this.tipos[tipo], nombre, ubicacion, descripcion, capacidad];
    }

    async update_tipos(){
        const sql = 'SELECT nombre, id FROM tipo';
        const data = await db.query(sql);
        data.forEach(value =>{
            if(! this.tipos[value.nombre])
                this.tipos[value.nombre] = value.id;
        });
    }

    async get_info(){
        const sql = 'SELECT tipo.nombre AS Tipos, facilidad.nombre AS Facilidades ' +
                        'FROM tipo LEFT JOIN facilidad ON tipo.id = facilidad.id ' +
                        'UNION ' +
                        'SELECT tipo.nombre AS Tipos, facilidad.nombre AS Facilidades ' +
                        'FROM tipo RIGHT JOIN facilidad ON tipo.id = facilidad.id ' +
                        'WHERE tipo.id IS NULL;';
        const info = {tipos:[], facilidades: []};
        const res = await db.query(sql);
        res.forEach(row =>{
            if(row.Tipos){
                info.tipos.push(row.Tipos);
            }
            if(row.Facilidades){
                info.facilidades.push(row.Facilidades);
            }
        });
        return info;
    }

    async add_new(params){
        const sql = 'INSERT INTO ambiente(id_tipo, nombre, ubicacion, descripcion, capacidad, deshabilitado, activo)' +
                         'VALUES(?, ?, ?, ?, ?, "no", "si")';
        const res = await db.query(sql, params);
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
        const sql = 'SELECT a.nombre, t.nombre AS tipo, a.ubicacion, a.descripcion, a.capacidad ' +
                        'FROM ambiente AS a LEFT JOIN tipo AS t on t.id=a.id_tipo WHERE a.nombre = ?';
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