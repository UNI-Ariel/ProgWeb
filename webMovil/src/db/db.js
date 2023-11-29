const mysql = require('mysql2/promise');
const config = require('../config');

async function query(sql, params) {
    const connection = await mysql.createConnection(config.localDB);
    const [rows, fields] = await connection.execute(sql, params);
    connection.end();
    return rows;
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
        throw err;
    });
    const data = !rows ? [] : rows;
    return data;
}

async function updateAmbiente(nombre, updateData){
    const update = 'UPDATE ambiente SET nombre = ?, id_tipo = ?, ubicacion = ?, descripcion = ?, capacidad = ?, deshabilitado = ?  WHERE id_ambiente = ?';
    const rows = await getAmbienteByName(nombre)
    .then(ambiente =>{
        query(update, [
            updateData.nombre, 
            updateData.id_tipo, 
            updateData.ubicacion, 
            updateData.descripcion, 
            updateData.capacidad, 
            updateData.deshabilitado, 
            ambiente[0].id_ambiente
        ]);
    })
    .catch(err =>{
        console.log('Error al actualizar datos del ambiente: ', err);
        throw err;
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

async function agregarReserva(params){
    const reserva = 'INSERT INTO reserva(id_ambiente, id_periodo, id_estado, fecha_reserva) VALUES (?, ?, P , ?)';
    const rows = await getAmbienteByName(params.nombre)
        .then((amb) =>{
            return query(reserva, [
                amb[0].id_ambiente,
                params.id_periodo,
                params.fecha
            ]);
        })
        .then(rows =>{
            return rows;
        })
        .catch(err =>{
            console.log('Error al agregar reserva', err);
            throw err;
        });
    const data = !rows ? [] : rows;
    return data;
}

const agregarReservas = async (req,res) => {
    try{
        
        const insert = 'INSERT INTO reservas(id_ambiente, id_periodo,id_estado, fecha_reserva) VALUES (?, ?, "P", ?)';
        const params = req.body;
        const result = await query( insert , [ 
            params.id_ambiente, 
            params.id_periodo, 
            params.fecha_reserva
        ]);
            res.json(result);
             
    }catch(error){
        res.status(500);
        res.send(error.message);
    }

}

async function getReservasPendientes(){
    const consulta = 'SELECT * FROM reserva WHERE reserva.id_estado = P';
    const rows = await query(consulta);
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
    const offset = (page - 1) * config.itemsPerPage;
    const data = await query(
        `SELECT * FROM ambiente WHERE activo = 'si' LIMIT  ${config.itemsPerPage} OFFSET ${offset}`
    );
    const meta = { page };
    return {
        meta, data
    };
}

async function getPeriodos(){
    let q = 'SELECT id_periodo, ';
    q += 'TIME_FORMAT(hora_ini, "%H:%i") AS hora_ini, ';
    q += 'TIME_FORMAT(hora_fin, "%H:%i") AS hora_fin FROM periodos';
    const rows = await query(q);
    const data = !rows ? [] : rows;
    return  data;
}

async function getAmbientesDisponibles(params){
    let disponibles = 'SELECT nombre AS Nombre, id_tipo as Tipo, ';
    disponibles += 'capacidad AS Capacidad, ubicacion as Ubicacion FROM ambiente as a ';
    disponibles += 'WHERE NOT EXISTS (';
    disponibles += 'SELECT * FROM reservas as b ';
    disponibles += 'WHERE a.id_ambiente = b.id_ambiente ';
    disponibles += 'AND b.fecha_reserva= ? ';
    disponibles += 'AND b.id_periodo = ? ';
    disponibles += 'AND b.id_estado= "A"';
    disponibles += ')';
    const rows = await query(disponibles, [params.fecha, params.horario]);
    const data = !rows ? [] : rows;
    return data;
}

async function deleteAmbiente(nombre){
    const del = 'UPDATE ambiente SET activo = no WHERE nombre = ?';
    const rows = await query(del, nombre);
    const data = !rows ? [] : rows;
    return data;
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
    updateAmbiente,
    deleteAmbiente,
    getAmbientes, 
    getAmbienteByName, 
    getAmbienteByID,
    getTipos,
    getPeriodos,
    getFacilidades,
    agregarReserva,
    getAmbientesDisponibles,
    getReservasPendientes,
    agregarReservas
};