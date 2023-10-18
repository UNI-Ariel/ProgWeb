const db = require('./config.js');
const mysql = require('mysql');

function createDatabase() {
    const conection = mysql.createConnection(db);
    conection.connect( (err) => {
        if (err.code === 'ER_BAD_BD_ERROR'){ //BD NO EXISTE
            conection.query('CREATE DATABASE IF NOT EXISTS progweb', (err) =>{
                if(err){
                    console.log('Error al crear base de datos: ', err);
                    return;
                }
            })
        }
    })
}