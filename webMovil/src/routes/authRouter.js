const controller = require('../controllers/authController');
const { Router } = require('express');
const jwt = require('jsonwebtoken');
/* const multer = require('multer');
const upload = multer(); */

const router = Router();

function check_log_status(req, res, next){
    if(req.session.logged){
        next();
    }
    else{
        res.redirect('/login');
    }
}

function is_admin(req, res, next){
    if(req.session.userData.grupo === 1){
        next();
    }
    else{
        res.redirect('/forbidden');
    }
}

function api_check_token(req, res, next){
    console.log('verify log and token');
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if(req.session.logged){
        next();
    }
    else if(token){
        jwt.verify(token, "dc-server-v3-ge2m-Y23", (err, decoded) =>{
            if(err){
                return res.status(401).json({code:401, body:"Invalid token"});
            }
            req.session.logged = true;
            req.session.userData = {"id": decoded.id, "nombre": decoded.nombre, "grupo": decoded.grupo};
            console.log(decoded);
            next();
        });
    }
    else{
        res.status(401).json({code:401, body:"Log in required"});
    }
}

function api_is_admin(req, res, next){
    console.log('verify admin');
    if(req.session.userData.grupo === 1){
        next();
    }
    else{
        res.status(401).json({code: 401, body:"Unauthorized"});
    }
}

//Page
router.get('/logout', check_log_status, controller.logout);
//Auth Level 1 Docente
router.get('/booking', check_log_status, controller.booking_page);

router.get('/booking/history', check_log_status, controller.booking_history);

//Auth Level 2 Administrador
router.get('/ambients', check_log_status, is_admin, controller.ambientes_page);

router.get('/bookings', check_log_status, is_admin, controller.check_bookings_page);

router.get('/bookings/history', check_log_status, is_admin, controller.bookings_history);

//API
//Auth Level 1 Docente
router.get('/api/booking', api_check_token, controller.api_get_bookables);

router.post('/api/booking/:name', api_check_token, controller.api_add_booking);

//Auth Level 2 Administrador
router.get('/api/ambientes', api_check_token, api_is_admin, controller.api_get_ambientes);

router.get('/api/ambientes/:name', api_check_token, api_is_admin, controller.api_get_ambiente);

/* router.post('/api/ambientes', upload.none(), controller.api_post_ambiente); */
router.post('/api/ambientes', api_check_token, api_is_admin, controller.api_post_ambiente);

router.put('/api/ambientes/:name', api_check_token, api_is_admin, controller.api_put_ambiente);

router.delete('/api/ambientes/:name', api_check_token, api_is_admin, controller.api_delete_ambiente);

router.get('/api/bookings', api_check_token, api_is_admin, controller.api_get_bookings);

router.get('/api/bookings/:booking', api_check_token, api_is_admin, controller.api_get_booking);

router.post('/api/bookings/:booking', api_check_token, api_is_admin, controller.api_update_booking);

module.exports = router;