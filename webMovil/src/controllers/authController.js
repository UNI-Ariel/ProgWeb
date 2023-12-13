const ambiente = require('../db/ambiente');
const client = require('../utils/client');
const tools = require('../utils/tools');

async function ambientes_page(req, res){
    const data = await ambiente.get_all({});
    res.render('adminAmbients', {title: 'Administrar Ambientes', data});
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
    const api_res = {};
    const name = req.params.name;
    if( ! tools.is_strict_text(name)){
        api_res.code = 400;
        api_res.body = "Invalid name for the request.";
    }
    else{
        const data = await ambiente.find(name);
        if(data.length){
            api_res.code = 200;
            api_res.body = data;
        }
        else{
            api_res.code = 404;
            api_res.body = "Ambient with name '" + name + "' does not exist.";
        }
    }
    res.status(api_res.code).json(api_res);
}

async function api_post_ambiente(req, res){
    const api_res = {};
    const data = req.body;
    if( ! client.is_ambient_valid_data(data) ){
        api_res.code = 400;
        api_res.body = "Invalid or missing parameters.";
    }
    else{
        const exists = await ambiente.find(data.nombre);
        if(exists.length){
            api_res.code = 422;
            api_res.body = "Requested name already exists: " + data.nombre;
        }
        else{
            const result = await ambiente.add_new(data);
            if(result){
                api_res.code = 201;
                api_res.body = "A new ambiente has been added.";
            }
            else{
                api_res.code = 500;
                api_res.body = "An error occured while adding a new ambient.";
                console.error("Failed to add new ambiente", req.body);
            }
        }
    }
    res.status(api_res.code).json(api_res);
}

async function api_put_ambiente(req, res){
    const api_res = {};
    const name = req.params.name;
    if( ! tools.is_strict_text(name)){
        api_res.code = 400;
        api_res.body = "The provided original ambient name for update is invalid.";
    }
    else if( client.is_ambient_valid_data(req.body) ){
        const current = await ambiente.find(name);
        if(current.length){
            if( client.is_put_updated_data(current[0], req.body)){
                if(name !== req.body.nombre){
                    const exists = await ambiente.find(req.body.nombre);
                    if(exists.length){
                        api_res.code = 422;
                        api_res.body = "The name already exists: " + req.body.nombre;
                        res.status(api_res.code).json(api_res);
                        return;
                    }                    
                }            
                const result = await ambiente.update_ambient(current[0], req.body);
                if(result){
                    api_res.code = 200;
                    api_res.body = "The  ambient has been updated.";
                }
                else{
                    api_res.code = 500;
                    api_res.body = "An error occured while uptading the ambient.";
                }
            
            }
            else{
                api_res.code = 400;
                api_res.body = "The provided data doesn't have any new changes to current ambient.";    
            }
        }
        else{
            api_res.code = 404;
            api_res.body = "The ambient you are trying to update doesn't exist.";
        }
    }
    else{
        api_res.code = 400;
        api_res.body = "Invalid or missing parameters for update.";
    }
    res.status(api_res.code).json(api_res);
}

module.exports = {
    api_get_ambientes,
    api_get_ambiente,
    api_post_ambiente,
    api_put_ambiente,
    ambientes_page
}