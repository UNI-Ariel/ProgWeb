const ambiente = require('../db/ambiente');

async function add_ambiente(req, res){
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

async function update_ambiente(req, res){
    const page = 'page' in req.query ? req.query.page : 1;
    const items_per_page = 'itemsPerPage' in req.query ? req.query.itemsPerPage : 10;
    const data = await ambiente.get_all(page, items_per_page);
    res.json(data);
}

module.exports = {
    add_ambiente,
    update_ambiente,
}