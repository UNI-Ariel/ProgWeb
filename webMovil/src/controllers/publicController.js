const ambiente = require('../db/ambiente');
const usuario = require('../db/usuario');
const client = require('../utils/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function index_page(req, res){
    const page_param = {title:'Pagina Principal'};
    if(req.session.logged){
        page_param['logged'] = true;
        page_param['userData'] = req.session.userData;
    }
    res.render('index', page_param);
}

function api_info(req, res){
    const info = {};
    const GET = {};
    const POST = {};
    const PUT = {};
    const DELETE ={};
    info.title = 'Información de ayuda sobre las rutas disponibles actuales.';
    info.rutes = ['GET /api/logout', 'GET /api/search', 'GET /api/booking', 'GET /api/booking/history', 'GET /api/ambientes',
        'GET /api/ambientes/nombre', 'GET /api/bookings', 'GET /api/bookings/:reserva', 'GET /api/bookingsHistory',
        'POST /api/login', 'POST /api/booking/:nombre', 'POST /api/ambientes', 'POST /api/bookings/:reserva', 
        'PUT /api/ambientes/:nombre', 'DELETE /api/ambientes/:name'];
    
    GET['/api/logout']= 'Permite cerrar la sesion iniciada con un token.';
    GET['/api/search'] = 'Permite buscar ambientes disponibles.\n' + 
        'Parametros URL:\nfecha: Es obligatoria y debe estar en formato YYYY-MM-DD.\n' +
        'horario: Es obligatoria y debe ser un numero de periodo (ver periodos en /api/info).\n' +
        'capacidad: Es obligatoria y debe ser un numero.';
    GET['/api/booking'] = 'Permite ver los ambientes reservables en una fecha y horario especificos.\n' +
        'Parametros URL:\nfecha: Es obligatoria y debe estar en formato YYYY-MM-DD.\n' +
        'horario: Es obligatoria y debe ser un numero de periodo (ver periodos en /api/info).\n' +
        'capacidad: Opcional, debe ser un numero.\ntipo: Opcional, debe ser un tipo de ambiente valido (ver tipos en /api/info).\n' +
        'facilidades: Opcional, debe ser una (o varias) facilidad(es) valida(s) (ver facilidades en /api/info).';
    GET['/api/booking/history'] = 'Permite ver el historial de las reservas realizadas.\nParametros URL:\n' +
        'fecha: Opcional, debe estar en formato YYYY-MM-DD.\npage: Opcional, para el numero de página.\n' +
        'perPage: Opcional, para resultados por página.';
    GET['/api/ambientes'] = 'Permite obtener todos los ambientes.\nParametros URL:\npage: Opcional, para el numero de página.\n' +
        'perPage: Opcional, para resultados por página.';
    GET['/api/ambientes/nombre'] = 'Permite obtener los datos de un ambiente particular.\nParametros URL:\nnombre: Nombre del ambiente.';
    GET['/api/bookings'] = 'Permite ver todas las reservas que estan pendientes de aceptar o rechazar.\nParametros URL:\n' +
        'page: Opcional, para el numero de página.\nperPage: Opcional, para resultados por página.';
    GET['/api/bookings/:reserva'] = 'Permite obtener la informacion de una reserva en particular.\nParametros URL:\nreserva: Numero de la reserva.';
    GET['/api/bookingsHistory'] = 'Permite ver el historial de las reservas que han hecho los usuarios y que ya no estan pendientes.\n' +
        'Parametros URL:\nfecha: Opcional, debe estar en formato YYYY-MM-DD.\npage: Opcional, para el numero de página.' +
        'perPage: Opcional, para resultados por página.';

    POST['/api/login'] = 'Permite obtener un token para las operaciones API, el cual se debe enviar en el header de las solicitudes.\n' +
        'Parametros requeridos en el BODY:\nuser: El nombre de usuario.\npass: La contraseña del usuario.';
    POST['/api/booking/:nombre'] = 'Permite enviar una solicitud de reserva para el ambiente especifico.\nParametros URL:\n' +
        'nombre: Nombre del ambiente.\nParametros requeridos en el BODY:\nfecha: Debe estar en formato YYYY-MM-DD.\n' +
        'periodo: debe ser un numero de periodo (ver periodos en /api/info).';
    POST['/api/ambiente'] = 'Permite agregar un nuevo ambiente.\nParametros requeridos en el BODY:\n' +
        'nombre: Una cadena, puede tener numeros y letras del alfabeto ingles unicamente. Adminte un unico espacio entre palabras. 32 caracteres max.\n' +
        'tipo: un tipo valido (ver tipos en /api/info).\nubicacion: Una cadena, debe ser no vacia. 100 caracteres max.\n' +
        'capacidad: Un numero. Entre 1 y 500.\ndescripcion: Alguna descripcion adicional. Puede ser vacio, pero debe existir el parametro. 200 caracteres max.\n' +
        'facilidades: Opcional, una o más facilidades validas (ver facilidades en /api/info).\n' +
        '        Si se incluye el parametro, no debe ser vacio y siempre debe ser un valor o valores validos.\n' +
        '        Si no se desea agregar facilidades, no agregar el parametro.\n' +
        '        Si es un solo valor, puede ir solo el valor o el valor dentro un arreglo.\n' +
        '        Si son varios valores, deben estar en un arreglo.';

    PUT['/api/ambientes/:nombre'] = 'Permite actualizar los datos de un ambiente.\nParametros URL:\n' +
        'nombre: El nombre del ambiente que se va a actualizar.\n' +
        'Parametros necesarios en el BODY: Es necesario que haya algun cambio en algun valor para actualizar.\n' +
        'nombre: el nombre actual o actualizado.\ntipo: un tipo valido (ver tipos en /api/info).' +
        'ubicacion: Una cadena, debe ser no vacia.\ncapacidad: Un numero.\ndescripcion: Opcional, Alguna descripcion adicional.\n' +
        'facilidades: Considedar que\n' +
        '   Si no se envia este parametro, se quitara todas las facilidades que tenga el Ambiente si es que los tenia.\n' +
        '   Para mantener las facilidades actuales, se debe mandar las mismas facilidades que tenia el ambiente.\n' +
        '   Una o más facilidades validas a cambiar (ver facilidades  en /api/info).';

    DELETE['/api/ambientes/:name'] = 'Permite deshabilitar un ambiente.\nParametros URL:\nnombre: Nombre del ambiente.';
    
    info.GET = GET;
    info.POST = POST;
    info.PUT = PUT;
    info.DELETE = DELETE;
    info.propiedades = ambiente.get_properties();
    res.json(info);
}

async function login_request(req, res){
    if(req.session.logged){
        res.redirect('/');
    }
    else{
        const request = req.body;
        if(! 'user' in request || ! 'pass' in request){
            res.render('login', {title:"iniciar sesión", msg: "Usuario o Contraseña incorrecto."});
        }
        else{
            const user_data = await usuario.find(request.user);
            if(! user_data.length){
                res.render('login', {title:"iniciar sesión", msg: "Usuario no existe."});
            }
            else{
                const user_hashed_password = user_data[0].password;
                const match = await bcrypt.compare(request.pass, user_hashed_password);
                if(match){
                    req.session.logged = true;
                    req.session.userData = {
                        id: user_data[0].id,
                        nombre: user_data[0].nombre,
                        grupo: user_data[0].id_grupo
                    };
                    res.redirect('/');
                }
                else{
                    res.render('login', {title:"iniciar sesión", user: request.user, msg: "Contraseña incorrecta."});
                }
            }
        }
    }
}

async function login_page(req, res){
    if(req.session.logged){
        res.redirect('/');
    }
    else{
        res.render('login', {title: 'Iniciar sesión'});
    }
}

async function search_page(req, res){
    const page_param = {title: 'Buscar Ambientes Disponibles'};
    if(req.session.logged){
        page_param['logged'] = true;
        page_param['userData'] = req.session.userData;
    }
    res.render('search', page_param);
}

async function forbidden_page(req, res){
    const page_param = {title:"No permitido"};
    if(req.session.logged){
        page_param['logged'] = true;
        page_param['userData'] = req.session.userData;
    }
    res.status(403).render('forbidden', page_param);
}

async function api_login(req, res){
    const api_res = {};
    if(req.session.logged){
        api_res.code = 200;
        api_res.body = "Already signed in.";
    }
    else if( ! ('user' in req.body) || ! ('pass' in req.body)){
        api_res.code = 400;
        api_res.body = "Missing login parameters.";
    }
    else{
        const user_data = await usuario.find(req.body.user);
        if(! user_data.length){
            api_res.code = 404;
            api_res.body = "User not found";
        }
        else{
            const user_hashed_password = user_data[0].password;
            const match = await bcrypt.compare(req.body.pass, user_hashed_password);
            if( ! match ){
                api_res.code = 400;
                api_res.body = "Wrong password.";
            }
            else{
                const id = user_data[0].id;
                const nombre = user_data[0].nombre;
                const grupo = user_data[0].id_grupo;
                const token = jwt.sign({id, nombre, grupo}, "dc-server-v3-ge2m-Y23", {expiresIn: "2h"});
                api_res.code = 200;
                api_res.body = token;
                req.session.logged = true;
                req.session.userData = {id, nombre, grupo};
            }
        }
    }
    res.status(api_res.code).json(api_res);
}

async function api_search(req, res){
    const api_res = {};
    const query = req.query;
    if(! client.is_search_available_valid_query(query) ){
        api_res.code = 400;
        api_res.body = "Invalid or missing parameters";
    }
    else{
        const data = await ambiente.search_available(query);
        if(data.length){
            api_res.code = 200;
            api_res.body = data;
        }
        else{
            api_res.code = 404;
            api_res.body = "There is no ambiente available for the given search parameters";
        }
    }
    res.status(api_res.code).json(api_res);
}

module.exports = {
    index_page,
    login_page,
    login_request,
    search_page,
    forbidden_page,
    api_info,    
    api_login,
    api_search
}