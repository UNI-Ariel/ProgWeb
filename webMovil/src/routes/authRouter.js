const controller = require('../controllers/authController');
const { Router } = require('express');

const router = Router();

router.get('/api/ambientes', controller.api_get_ambientes);

router.get('/api/ambientes/:name', controller.api_get_ambiente);

router.post('/api/ambientes', controller.api_post_ambiente);

router.put('/api/ambientes/:name', controller.api_put_ambiente);

router.get('/ambients', controller.ambientes_page);

module.exports = router;