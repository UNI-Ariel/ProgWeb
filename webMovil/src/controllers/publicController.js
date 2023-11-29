const ambiente = require('../db/ambiente');
const { valid_text, get_filters } = require('../utils/tools');

async function index_page(req, res){
    res.render('index', {title: 'Pagina Principal'});
}

async function api_info(req, res){
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
    info.propiedades = await ambiente.get_info();
    res.json(info);
}

async function api_get_ambientes(req, res){
    const filters = get_filters(req.query);
    const data = await ambiente.get_all(filters);
    if(data.length){
        res.json(data);
    }
    else{
        res.status(404).send("The requested resource was not found");
    }
}

async function api_get_ambiente(req,res){
    const name = req.params.name;
    if( ! valid_text(name)){
        res.status(400).send("Bad name request");
    }
    else{
        const data = await ambiente.find(name);
        if(data.length){
            res.json(data);
        }
        else{
            res.status(404).send("The requested resource was not found");
        }
    }
}

module.exports = {
    index_page,
    api_info,
    api_get_ambiente,
    api_get_ambientes
}