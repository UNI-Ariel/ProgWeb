const config = {
    app_port: 7777,
    localDB: {
        host: 'localhost',
        user: 'root',
        password: '',
        port: '3306',
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