const { Router } = require('express');

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

router.get('/academico/buscarAulas', (req, res) =>{
    res.render('buscarAulas', {title: 'Buscar Aulas Disponibles'});
});

router.get('/administrativo', (req, res) =>{
    res.render('administrativo', {title: 'Administrativo'});
});

router.get('/opciones', (req, res) =>{
    res.render('index');
});

module.exports = router;