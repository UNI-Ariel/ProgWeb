const http = require('http');
const fs = require('fs');
const path = require('path');

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
        if(req.url === '/agregar'){
            let content = '';
            req.on('data', chunk => {
                content += chunk;
            });
            req.on('end', () => {
                let data = new URLSearchParams(content);
                console.log(data);
                res.end('Recived');
            });
        }
    }
}

const server = http.createServer(serverHandle);

server.listen(PORT, ()=>{
    console.log(`Servidor en el puerto ${PORT}`);
});