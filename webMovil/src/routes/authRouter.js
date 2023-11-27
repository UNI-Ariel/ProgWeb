const controller = require('../controllers/authController');
const { Router } = require('express');

const router = Router();

router.post('/api/ambientes', controller.add_ambiente);

router.put('/api/ambientes/:name', controller.update_ambiente);

module.exports = router;