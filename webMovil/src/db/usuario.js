const db = require('./database');
class Usuario{
    async find(user){
        const sql = 'SELECT * FROM usuarios WHERE nombre=?';
        const data = await db.query(sql, [user]);
        return data;
    }
}

module.exports = new Usuario();