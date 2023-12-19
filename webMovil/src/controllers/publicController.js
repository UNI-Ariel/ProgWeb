const ambiente = require('../db/ambiente');
const client = require('../utils/client');

async function index_page(req, res){
    res.render('index', {title: 'Pagina Principal'});
}

function api_info(req, res){
    const info = {};
    const GET = {};
    const POST = {};
    const DELETE ={};
    info.title = 'Información de ayuda sobre las rutas disponibles actuales.';
    info.rutes = ['GET /api/search', 'GET /api/booking', 'GET /api/ambientes', 'GET /api/ambientes/nombre', 'GET /api/bookings',
        'GET /api/bookings/:reserva', 'POST /api/booking/:nombre', 'POST /api/ambiente', 'POST /api/bookings/:reserva', 'DELETE /api/ambientes/:name'];

    GET['/api/search'] = 'Permite buscar ambientes disponibles.\n' + 
        'Parametros URL:\nfecha: Es obligatoria y debe estar en formato YYYY-MM-DD.\n' +
        'horario: Es obligatoria y debe ser un numero de periodo (ver periodos en /api/info).\n' +
        'capacidad: Es obligatoria y debe ser un numero.';
    GET['/api/booking'] = 'Permite ver los ambientes reservables en una fecha y horario especificos.\n' +
        'Parametros URL:\nfecha: Es obligatoria y debe estar en formato YYYY-MM-DD.\n' +
        'horario: Es obligatoria y debe ser un numero de periodo (ver periodos en /api/info).\n' +
        'capacidad: Opcional, debe ser un numero.\ntipo: Opcional, debe ser un tipo de ambiente valido (ver tipos en /api/info).\n' +
        'facilidades: Opcional, debe ser una (o varias) facilidad(es) valida(s) (ver facilidades en /api/info).';
    GET['/api/ambientes'] = 'Permite obtener todos los ambientes.\nParametros URL:\npage: Opcional, para el numero de página.\n' +
        'perPage: Opcional, para resultados por página.';
    GET['/api/ambientes/nombre'] = 'Permite obtener los datos de un ambiente particular.\nParametros URL:\nnombre: Nombre del ambiente.';
    GET['/api/bookings'] = 'Permite ver todas las reservas que estan pendientes de aceptar o rechazar.\nParametros URL:\n' +
        'page: Opcional, para el numero de página.\nperPage: Opcional, para resultados por página.';
    GET['/api/bookings/:reserva'] = 'Permite obtener la informacion de una reserva en particular.\nParametros URL:\nreserva: Numero de la reserva.';

    POST['/api/booking/:nombre'] = 'Permite enviar una solicitud de reserva para el ambiente especifico.\nParametros URL:\n' +
        'nombre: Nombre del ambiente.\nParametros requeridos en el BODY:\nfecha: Debe estar en formato YYYY-MM-DD.\n' +
        'periodo: debe ser un numero de periodo (ver periodos en /api/info).';
    POST['/api/ambiente'] = 'Permite agregar un nuevo ambiente.\nParametros requeridos en el BODY:\n' +
        'nombre: Una cadena, puede tener numeros, letras del alfabeto ingles y un espacio entre palabras.\n' +
        'tipo: un tipo valido (ver tipos en /api/info).\nubicacion: Una cadena, debe ser no vacia.\ncapacidad: Un numero.\n' +
        'descripcion: Opcional, Alguna descripcion adicional.';
    POST['/api/bookings/:reserva'] = 'Permite aceptar o rechazar una reserva pendiente.\nParametros URL:\n' +
        'reserva: Numero de la reserva.\nParametros requeridos en el BODY:\naction: Una cadena, "accept" para aceptar la reserva, "reject" para rechazar la reserva.';

    DELETE['/api/ambientes/:name'] = 'Permite deshabilitar un ambiente.\nParametros URL:\nnombre: Nombre del ambiente.';
    
    info.GET = GET;
    info.POST = POST;
    info.DELETE = DELETE;
    info.propiedades = ambiente.get_properties();
    res.json(info);
}

async function login_page(req, res){
    res.render('login', {title: 'Iniciar sesión'});
}

async function search_page(req, res){
    res.render('search', {title: 'Buscar Ambientes Disponibles'});
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
    api_info,
    search_page,
    api_search
}