const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const db = require('./database/config.js');

const PORT = process.env.PORT || 8000;
const public = path.join(__dirname, 'public');
const mime = {
    html: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
    png: 'image/png',
    jpg: 'image/jpg',
    ico: 'image/x-icon'
}

const postOP = {
    login: 'Login data',
    reserva: 'Solicitud de Reserva',
    consulta: 'Solicitud de Consulta',
    agregar: 'Agregar aula'
}

const serverHandle = function(req, res){
    if(req.method === 'GET'){
        let filePath;
        //console.log(req.url);
        filePath = req.url === '/' ? path.join(public, 'index.html') : path.join(public, req.url);
        let contentType = mime[path.extname(filePath).slice(1)] || 'text/plain';
        let stream = fs.createReadStream(filePath);
        //console.log(`Preparando ${filePath}`);
        stream.on('open', function(){
            res.writeHead(200, {'Content-Type': contentType});
            stream.pipe(res);
        });
        stream.on('error', function(){
            res.writeHead(404, {'Content-Type': contentType});
            res.end('No encontrado');
            console.log(`No se encontro el recurso: ${filePath}`);
        });
    } else if(req.method === 'POST'){
        let op = postOP[req.url.slice(1)] || 'unhandled';
        console.log(op);
        if(op === 'unhandled'){
            res.writeHead(403, {'Content-Type': 'text/plain'});
            return res.end('Operacion no Permitida');
        }else{
            let content = '';
            req.on('data', chunk => {
                content += chunk;
            });
            req.on('end', () => {
                let data = new URLSearchParams(content);
                console.log(data);
                switch (op){
                    case 'Login data':
                        let user = data.get('user');
                        let pass = data.get('pass');
                        console.log(`Verificando usuario con id ${user}`)
                        const connection = mysql.createConnection(db);
                        connection.connect( (err) =>{
                            if(err){
                                console.log(`Error conexion con Base de datos ${err}`);
                                res.end('No hay conexion con la base de datos.');
                                return;
                            }
                            let query = `SELECT * FROM usuario WHERE id = ?`
                            connection.query(query, user, (err, result) =>{
                                if(err){
                                    console.log(err);
                                    return;
                                }
                                if(result.length > 0){
                                    console.log('El usuario ' , user, ' esta registrado.');
                                    res.end(`El usuario ${user} existe`);
                                }
                                else{
                                    console.log('El usuario ' , user, ' no esta registrado.');
                                    res.end(`El usuario ${user} no existe`);
                                }
                            });
                            connection.end( (err) =>{
                                if(err){
                                    console.log(`Error al cerrar conexion con la Base de datos ${err}`);
                                    return;
                                }
                            });
                        });

                        //res.end(`Recivido ${data}`);
                        break;
                    default:
                        res.end(`Recivido ${data}`);
                }
            });
        }
    }
}

const server = http.createServer(serverHandle);

server.listen(PORT, ()=>{
    console.log(`Servidor en el puerto ${PORT}`);
});