const controller = require('../controllers/publicController');
const { Router } = require('express');

const router = Router();

router.get('/api/ambientes', controller.get_all_ambientes);

router.get('/api/ambientes/:name', controller.get_ambiente);

module.exports = router;