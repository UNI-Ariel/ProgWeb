const ambiente = require('../db/ambiente');
const { valid_text, get_filters } = require('../utils/tools');

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

async function api_post_ambiente(req, res){
    const data = ambiente.get_data(req.body);
    if(! data.length ){
        res.status(400).send("Invalid or missing parameters");
    }
    else {
        const exists = await ambiente.find(req.body.nombre);
        if(exists.length){
            res.status(422).send("Requested name already exists: " + req.body.nombre);
        }
        else{
            const result = await ambiente.add_new(data);
            if(result){
                res.status(201).send("A new ambiente has been added");
            }
            else{
                console.error("Failed to add new ambiente", req.body);
                res.status(500).send("An error occured while creating the new resource");
            }
        }
    }
}

async function api_put_ambiente(req, res){
}

module.exports = {
    api_get_ambientes,
    api_get_ambiente,
    api_post_ambiente,
    api_put_ambiente,
    ambientes_page
}