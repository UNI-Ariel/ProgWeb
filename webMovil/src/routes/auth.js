const { Router, query } = require('express');
const db = require('../db/db');

const router = Router();

router.get('/academico/reservarAmbientes', (req, res) =>{
    res.render('reservarAmbientes', {title: 'Reservar Ambientes'});
});

router.get('/administrativo/agregarAmbientes', async (req, res) =>{
    try{
        const tipos = await db.getTipos();
        /* console.log(tipos); */
        res.render('agregarAmbientes', {title: 'Agregar Ambientes', tipos});
    }
    catch (err) {
        res.status(500).send(`Error: ${err.message}`);
    }
});

router.post('/administrativo/agregarAmbientes', async (req, res) =>{
    console.log(req.body);
    try{
        const data = await db.getAmbiente(req.body.nombre);
        if(data.length){
            const tipos = await db.getTipos();
            res.render('agregarAmbientes', {title: 'Agregar Ambientes', tipos, message:'Ya existe un aula con ese nombre'});
            /* res.json({message: 'Ya existe un aula con ese nombre'}); */
        }
        else{
            /* res.json({message: 'Se ha agregado un ambiente'}); */
            const insert = 'INSERT INTO ambiente (nombre, id_tipo, ubicacion, descripcion, capacidad, deshabilitado, activo) VALUES (?, ?, ?, ?, ?, ?, ?)';
            await db.query(insert, [req.body.nombre, req.body.id_tipo, req.body.ubicacion, req.body.descripcion,
                req.body.capacidad, req.body.deshabilitado, req.body.activo]);
                
            res.redirect('/administrativo/administrarAmbientes');
        }
    }
    catch (err){
        res.status(500).send(`Error: ${err.message}`);
    }
   
});

router.get('/administrativo/administrarAmbientes', async (req, res) =>{
    try{
        const data = await db.getAmbientes(1);
        const rows = data.data;
        const message = res.message;
        /* console.log(data);
        res.json(data); */ 
        res.render('administrarAmbientes', {title: 'Administrar Ambientes', rows, message});
    }
    catch (err) {
        res.status(500).send(`Error: ${err.message}`);
    }
        
});

router.put('/administrarAmbientes/:id', async (req, res) =>{
    
});

module.exports = router;