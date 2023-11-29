const ambiente = require('../db/ambiente');

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
    api_post_ambiente,
    api_put_ambiente,
}