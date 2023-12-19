const mysql = require('mysql2/promise');
const config = require('../config');

const poolLimit = 3;

class Database {
    constructor(settings = {...config.localDB}){
        if(! settings || ! 'host' in settings || ! 'user' in settings ||
        ! 'password' in settings || ! 'database' in settings ){
            throw new Error('Missing Database configuration variables');
        }

        if(! 'connectionLimit' in settings){
            settings.connectionLimit= poolLimit;
        }
        
        console.log('Connecting to database at', settings.host, 'on PORT:', settings.port);

        this.pool = mysql.createPool( settings );
    }

    async query(sql, params){
        const conn = await this.pool.getConnection();

        try{
            const [rows, fields] = await conn.execute(sql, params);
            return rows;
        }
        catch (err){
            console.error('An error occured while executing Query:', sql, err.message);
        }
        finally{
            conn.release();
        }
    }
}

module.exports = new Database();