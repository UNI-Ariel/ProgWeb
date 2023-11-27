const ambiente = require('../db/ambiente');
const { valid_text, get_filters } = require('../utils/tools');

async function get_all_ambientes(req, res){
    const filters = get_filters(req.query);
    const data = await ambiente.get_all(filters);
    if(data.length){
        res.json(data);
    }
    else{
        res.status(404).send("The requested resource was not found");
    }
}

async function get_ambiente(req,res){
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
    get_all_ambientes,
    get_ambiente
}