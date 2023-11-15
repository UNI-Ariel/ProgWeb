const mysql = require('mysql2/promise');

const settings = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'myspotplay'
}

const consultas = {
    insertar: `INSERT INTO listsongs (playlist_id, song_id) VALUES (${playlist_id},${song_id})`,
    eliminar: `DELETE FROM listsongs WHERE playlist_id=${playlist_id} AND song_id=${song_id}`
}

/* const db_con = {};

async function openConnection(){
    const connection = await mysql.createConnection(settings)
    .then((connected)=>{
        connection = connected;
        console.log('Se establecio la coneccion con la base de datos');
    })
    .catch(err, ()=>{
        console.log('Ocurrio un error al conectar la base de datos.', err);
        process.exit(1);
    });
    return connection;
} */

async function query(sql, params) {
    const connection = await mysql.createConnection(settings);
    const [rows, fields ] = await connection.execute('DESCRIBE listsongs');
    connection.end();
    console.log(rows, fields);
    return rows;
}

//Funsion insertar
/* async function insertarEnPlaylist(playlist_id, song_id){
    const rows = await query(consultas.insertar, [playlist_id, song_id]);
    return rows;
} */


/* insertarEnPlaylist(26, 17).then(()=>{
    console.log('Se ingreso un registro.');

    return;
})
.catch(err =>{
    console.log('Ocurrio un error', err);
}); */
query();