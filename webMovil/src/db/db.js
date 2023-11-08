const mysql = require('mysql2/promise');
const config = require('../config');

async function query(sql, params) {
    const connection = await mysql.createConnection(config.localDB);
    const [results, ] = await connection.execute(sql, params);
    return results;
}

async function agregarAmbiente(params){
    const insert = 'INSERT INTO ambiente (nombre, id_tipo, ubicacion, descripcion, capacidad, deshabilitado, activo) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const rows = await query(insert, [
        params.body.nombre, 
        params.body.id_tipo, 
        params.body.ubicacion, 
        params.body.descripcion,
        params.body.capacidad, 
        params.body.deshabilitado,
        1,
    ]);
    const data = !rows ? [] : rows;
    if("facilidades" in params){
        insert = 'INSERT INTO facilidades (id_ambiente, id_facilidad) VALUES (?, ?)'
        if(Array.isArray( params.facilidades)){
            params.facilidades.forEach(async (id_facilidad) => {
                await query(insert,[params.id_ambiente, id_facilidad]);
            });
        }
        else{
            await query(insert,[params.id_ambiente, params.facilidades]);
        }
    }
    return data;
}

async function getTipos(sql, params){
    const rows = await query(
        `SELECT * FROM tipo`
    );
    const data = !rows ? [] : rows;
    return data;
}

async function getAmbienteByName(name){
    const rows = await query(
        `SELECT * FROM ambiente WHERE nombre = '${name}'`
    );
    const data = !rows ? [] : rows;
    return data;
}

async function getAmbienteByID(id){
    const rows = await query(
        `SELECT * FROM ambiente WHERE id_ambiente = '${id}'`
    );
    const data = !rows ? [] : rows;
    return data;
}

async function getAmbientes(page = 1){
    const offset = page - 1;
    const rows = await query(
        `SELECT * FROM ambiente LIMIT ${config.itemsPerPage} OFFSET ${offset} `
    );
    const meta = { page };
    const data = !rows ? [] : rows;
    return {
        meta, data
    };
}

async function getFacilidades(){
    const rows = await query(
        `SELECT * FROM facilidad`
    );
    const data = !rows ? [] : rows;
    return data;
}

module.exports = { 
    agregarAmbiente,
    getAmbientes, 
    getAmbienteByName, 
    getAmbienteByID,
    getTipos,
    getFacilidades
};