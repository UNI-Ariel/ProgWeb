const { Router } = require('express');
const db = require('../db/db');

const router = Router();

router.get('/academico/reservarAulas', (req, res) =>{
    res.render('reservarAulas', {title: 'Reservar Aulas'});
});

router.get('/administrativo/agregarAulas', (req, res) =>{
    res.render('agregarAulas', {title: 'Agregar Aulas'});
});

router.post('/administrativo/agregarAulas', (req, res) =>{
    console.log(req.body);
    res.render('agregarAulas', {title: 'Agregar Aulas'});
});

router.get('/administrativo/administrarAulas', async (req, res) =>{
    try{
        const data = await db.getAmbientes(1);
        console.log(data);
        /* res.json(data); */
        res.render('administrarAulas', {title: 'Administrar Aulas'});
    }
    catch (err) {
        console.error('Error en la base de datos:', err.message);
        res.send('Error');
    }
        
});

module.exports = router;