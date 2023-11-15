//Modules
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
//Route Files
const public = require('./routes/publicRouter');
const home = require('./routes/home');
const auth = require('./routes/auth');
const other = require('./routes/other');
//Utils
const argParser = require('./utils/argumentParser');
//Config
const config = require('./config');
//Server
const app = express();
//Check Arguments
const args = argParser(process.argv);
if('app_port' in args){
    config.app_port = args.app_port;
}
if('db_port' in args){
    config.localDB.port = args.db_port;
}
//Settings
app.set('port', config.app_port);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//Data recived
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) =>{
    console.log(req.method, req.url);
    next();
});
//Routes
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));
app.use(public);
app.use(home);
app.use(auth);
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(other);
//Start Server
app.listen(app.get('port'), ()=>{
    console.log('Servidor Iniciado.');
    console.log(`Puerto de escucha del serividor: ${app.get('port')}`);
    console.log('Puerto de la base de datos local:', config.localDB.port);
});