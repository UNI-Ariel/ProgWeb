const config = {
    localDB: {
        host: 'localhost',
        user: 'root',
        password: '',
        port: '33065',
        database: 'cloud-db'
    },
    cloudDB: {
        host: 'aws.connect.psdb.cloud',
        user: 'jgngli6g1yem3cx1e66z',
        password: 'pscale_pw_guDvgyOmhtbdDjGQK44gO5zx0tockygzjW2IMQxldQB',
        database: 'cloud-db',
        ssl: {
            rejectUnauthorized: false
        }
    },
    itemsPerPage: 10
};

module.exports = config;

/* const localDB = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cloud-db',
    ssl: {
        rejectUnauthorized: false
    }
}
const cloudDB = {
    host: 'aws.connect.psdb.cloud',
    user: 'jgngli6g1yem3cx1e66z',
    password: 'pscale_pw_guDvgyOmhtbdDjGQK44gO5zx0tockygzjW2IMQxldQB',
    database: 'cloud-db',
    ssl: {
        rejectUnauthorized: false
    }
}

async function connectDB() {
    const connection = await mysql.createConnection(localDB);
    connection.connect((err) =>{
        if(err){
            console.log('Error al conectar con la base de datos');
            return;
        }
        console.log('Conectado con la base de datos');
        return connection;
    });
}

async function queryDB(q){
    const connection = connectDB();
    connection.query(q);
    connection.close((err) =>{
        if(err) console.log(err);
    });
}

module.exports = queryDB; */