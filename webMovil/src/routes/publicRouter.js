const controller = require('../controllers/publicController');
const { Router } = require('express');

const router = Router();

router.get('/', controller.index_page);

router.get('/api/info', controller.api_info);

router.get('/api/ambientes', controller.api_get_ambientes);

router.get('/api/ambientes/:name', controller.api_get_ambiente);

module.exports = router;