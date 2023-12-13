//Modules
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');

//Routers
const public = require('./routes/publicRouter');
const auth = require('./routes/authRouter');
const other = require('./routes/other');

//Utils
const arguments = require('./utils/arguments');

//Config
const config = require('./config');

//database
const ambiente = require('./db/ambiente');

//Server
const app = express();

//Initialize database data
ambiente.init_properties();

//Check Arguments
const args = arguments.getArguments(process.argv);
if('app_port' in args){
    config.app_port = args.app_port;
}
if('db_port' in args){
    config.localDB.port = args.db_port;
}

//Settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Data logger
app.use((req, res, next) =>{
    console.log(req.method, req.url);
    next();
});

//Data recived
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Routes
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));
app.use(public);
app.use(auth);
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(other);

//Start Server
app.listen(config.app_port, ()=>{
    console.log('Server listening on PORT:', config.app_port);
});
