const controller = require('../controllers/authController');
const { Router } = require('express');

const router = Router();

router.post('/api/ambientes', controller.api_post_ambiente);

router.put('/api/ambientes/:name', controller.api_put_ambiente);

module.exports = router;