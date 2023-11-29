const { Router, query } = require('express');
const db = require('../db/db');

const router = Router();

router.get('/usuario', (req, res) =>{
    res.render('usuario', {title: 'Usuario'});
});

router.get('/academico/reservarAmbientes', async (req, res) =>{
    const ambientes = (await db.getAmbientes(1)).data;
    const horarios = await db.getPeriodos();
    res.render('reservarAmbientes', {title: 'Reservar Ambientes', ambientes, horarios});
});

router.post('/academico/reservarAmbientes', async (req, res) =>{
    console.log(req.body);
    await db.getAmbienteByName(req.body.nombre)
    .then(ambiente =>{
        return db.agregarReserva([
            ambiente.id_ambiente,
            req.body.horario,
            'P',
            req.body.fecha
        ]);
    })
    .then(rows =>{
        res.json(rows);
    })
    .catch(err =>{
        res.json({Message: "Error", err});
    });
});

router.post('/api/reservarAulas', db.agregarReservas );

router.get('/administrativo/agregarAmbientes', async (req, res) =>{
    try{
        const tipos = await db.getTipos();
        const facilidades = await db.getFacilidades();
        /* console.log(tipos); */
        res.render('agregarAmbientes', {title: 'Agregar Ambientes', tipos, facilidades});
    }
    catch (err) {
        res.status(500).send(`Error: ${err.message}`);
    }
});

router.get('/administrativo/agregarAmbientesLotes', (req, res) =>{
    res.render('agregarAmbientesLotes', {title: 'Agregar Ambientes por Lotes'});
});

router.post('/administrativo/agregarAmbientes', async (req, res) =>{
    /* console.log(req.body); */
    try{
        const data = await db.getAmbienteByID(req.body.nombre);
        if(data.length){
            const tipos = await db.getTipos();
            const facilidades = await db.getFacilidades();
            res.render('agregarAmbientes', {title: 'Agregar Ambientes', tipos, facilidades, message:'Ya existe un aula con ese nombre'});
            /* res.json({message: 'Ya existe un aula con ese nombre'}); */
        }
        else{
            /* res.json({message: 'Se ha agregado un ambiente'}); */
            await db.agregarAmbiente(req.body);
            res.redirect('/administrativo/administrarAmbientes');
        }
    }
    catch (err){
        res.status(500).send(`Error: ${err.message}`);
    }
   
});

router.post('/subirCSV', async (req, res) =>{
    console.log(req.body);
    res.send("Archivo recivido");
});

router.get('/administrativo/administrarAmbientes', async (req, res) =>{
    try{
        const data = await db.getAmbientes(1);
        const rows = data.data;
        const message = res.message;
        /* console.log(data); */
       /*  res.json(data);  */
        res.render('administrarAmbientes', {title: 'Administrar Ambientes', rows, message});
    }
    catch (err) {
        res.status(500).send(`Error: ${err.message}`);
    }
        
});

router.get('/administrativo/editarAmbiente/:nombre', async (req, res) =>{
    try{
        const data = await db.getAmbienteByName(req.params.nombre);
        const tipos =  await db.getTipos();
        if(data.length){
            const ambiente = data[0];
            res.render('editarAmbiente', {title: 'Editar Ambiente', tipos, ambiente});
        }
        else{
            res.render('editarAmbiente', {title: 'Editar Ambiente'});
        }
    }
    catch (err) {
        res.status(500).send(`Error: ${err.message}`);
    }
});

router.put('/administrativo/editarAmbiente/:nombre', async (req, res) => {
    console.log(req.body);
    try{
        db.updateAmbiente(req.params.nombre, req.body);
        res.json({Mensaje: "Se actualizo el ambiente"});
    }
    catch (err){
        console.log(err);
        res.json({Mensaje: "Error: No se actualizo el ambiente"});
    }
});

module.exports = router;