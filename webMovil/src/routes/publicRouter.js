const publicController = require('../controllers/publicController');
const { Router } = require('express');

const router = Router();

router.get('/api/ambientes', publicController.getAmbientes);
router.get('/api/ambientes/:name', publicController.getAmbiente);

router.post('/api/ambientes', (req, res) =>{});
router.put('/api/ambientes/:name', (req, res) =>{});

module.exports = router;