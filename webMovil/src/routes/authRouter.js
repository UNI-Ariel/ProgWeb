const controller = require('../controllers/authController');
const { Router } = require('express');
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

//Page
router.get('/logout', check_log_status, controller.logout);
//Auth Level 1 Docente
router.get('/booking', check_log_status, controller.booking_page);

//Auth Level 2 Administrador
router.get('/ambients', check_log_status, is_admin, controller.ambientes_page);

router.get('/bookings', check_log_status, is_admin, controller.check_bookings_page);

router.get('/bookings/history', check_log_status, is_admin, controller.bookings_history);

//API
//Auth Level 1 Docente
router.get('/api/booking', controller.api_get_bookables);

router.post('/api/booking/:name', controller.api_add_booking);

//Auth Level 2 Administrador
router.get('/api/ambientes', controller.api_get_ambientes);

router.get('/api/ambientes/:name', controller.api_get_ambiente);

/* router.post('/api/ambientes', upload.none(), controller.api_post_ambiente); */
router.post('/api/ambientes', controller.api_post_ambiente);

router.put('/api/ambientes/:name', controller.api_put_ambiente);

router.delete('/api/ambientes/:name', controller.api_delete_ambiente);

router.get('/api/bookings', controller.api_get_bookings);

router.get('/api/bookings/:booking', controller.api_get_booking);

router.post('/api/bookings/:booking', controller.api_update_booking);

module.exports = router;