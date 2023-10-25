const mysql = require('mysql2/promise');
const config = require('../config');

async function query(sql, params) {
    const connection = await mysql.createConnection(config.localDB);
    
   const [results, ] = await connection.execute(sql, params);
    return results;
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

module.exports = { getAmbientes };