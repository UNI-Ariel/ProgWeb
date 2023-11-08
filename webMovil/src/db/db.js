const mysql = require('mysql2/promise');
const config = require('../config');

async function query(sql, params) {
    const connection = await mysql.createConnection(config.localDB);
    const [results, ] = await connection.execute(sql, params);
    return results;
}

async function agregarFacilidadesAmbiente(id_ambiente, facilidades){
    const insert = 'INSERT INTO facilidades (id_ambiente, id_facilidad) VALUES (?, ?)'
    if(Array.isArray(facilidades)){
        facilidades.forEach(async (facilidad) => {
            console.log(facilidad);
            await query(insert, [ id_ambiente, facilidad ] );
        });
    }
    else{
        await query(insert, [id_ambiente, facilidades] );
    }
}

async function agregarAmbiente(params){
    const insert = 'INSERT INTO ambiente (nombre, id_tipo, ubicacion, descripcion, capacidad, deshabilitado, activo) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const rows = await query(insert, [
        params.nombre, 
        params.id_tipo, 
        params.ubicacion, 
        params.descripcion,
        params.capacidad, 
        params.deshabilitado,
        'si',
    ]).then(rows => {
        console.log('Se agrego un Ambiente a la base de datos. id: ', rows.insertId);
        if("facilidades" in params){
            agregarFacilidadesAmbiente(rows.insertId, params.facilidades);
        }
    })
    .catch(err => {
        console.log('Error al agregar ambiente: ', err);
    });
    const data = !rows ? [] : rows;
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
    agregarFacilidadesAmbiente,
    getAmbientes, 
    getAmbienteByName, 
    getAmbienteByID,
    getTipos,
    getFacilidades
};