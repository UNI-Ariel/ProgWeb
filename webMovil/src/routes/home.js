const { Router } = require('express');
const db = require('../db/db');

const router = Router();

router.get('/', (req, res) =>{
    res.render('index', {title: 'Pagina Principal'});
});

router.get('/usuario', (req, res) =>{
    res.render('usuario', {title: 'Usuario'});
});

router.get('/academico', (req, res) =>{
    res.render('academico', {title: 'Academico'});
});

router.get('/academico/verAmbientes', async (req, res) =>{
    const periodos = await db.getPeriodos();
    res.render('buscarAmbientes', {title: 'Ver Ambientes Disponibles', periodos});
});

router.post('/academico/verAmbientes', async (req, res) =>{
    console.log(req.body);
    const disponibles = await db.getAmbientesDisponibles(req.body);
    res.json(disponibles);
});

router.get('/administrativo', (req, res) =>{
    res.render('administrativo', {title: 'Administrativo'});
});

router.get('/opciones', (req, res) =>{
    res.render('index');
});

module.exports = router;