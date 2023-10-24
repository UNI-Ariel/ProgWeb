//Modules
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
//Route Files
const home = require('./routes/home');
const auth = require('./routes/auth');
const other = require('./routes/other');
//Server
const app = express();
//Settings
app.set('port', 9000 || process.env.PORT);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//Data recived
app.use(express.urlencoded({extended: false}));
app.use((req, res, next) =>{
    console.log(req.method, req.url);
    next();
});
//Routes
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));
app.use(home);
app.use(auth);
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(other);
//Start Server
app.listen(app.get('port'), ()=>{
    console.log(`Servidor en el puerto ${app.get('port')}`);
});