const db = require('../db/db');

async function getAmbientes(req, res){
    const page = 'page' in req.query ? req.query.page : 1;
    const amb = await db.getAmbientes(page);
    res.json(amb);
}

async function getAmbiente(req,res){
    const name = req.params.name;
    const amb = await db.getAmbienteByName(name);
    res.json(amb);
}

module.exports = {
    getAmbientes,
    getAmbiente
}