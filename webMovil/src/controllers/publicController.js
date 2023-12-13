const ambiente = require('../db/ambiente');
const client = require('../utils/client');

async function index_page(req, res){
    res.render('index', {title: 'Pagina Principal'});
}

function api_info(req, res){
    const info = {};
    const ambientes = {};
    info.title = 'Información de ayuda sobre las rutas disponibles actuales.';
    info.rutes = ['/api/ambientes', '/api/ambientes/nombre'];
    ambientes.general = 'Solicitudes disponibles: GET para obtener todos los ambientes sin el nombre en la URL ' +
        'y un solo ambiente con el nombre en la URL y POST para agregar un solo ambiente.';
    ambientes.get = 'La solicitud GET puede ser acompañada por los parametros de consulta ' +
        '"page" para el numero de la pagina y "perPage" para indicar cuantos resultados ' +
        'ver por pagina cuando se solicita todos los ambientes.';
    ambientes.post = 'Para agregar un nuevo ambiente se requieren los parámetros "nombre" el cual debe ' +
        'tener al menos un carácter, debe ser estrictamente alfanumérico y se admiten espacios. \n "tipo" el cual debe ' +
        'ser uno de los valores validos del tipo en las propiedades. \n "ubicacion" debe ser distinto de vacío y admite ' +
        'cualquier tipo de caracter. \n "descripcion" que puede ser vacío sin restricciones y "capacidad" ' + 
        'el cual es estrictamente numérico. \n de momento se deshabilito el poder agregar facilidades.';
    info.ambientes = ambientes;
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