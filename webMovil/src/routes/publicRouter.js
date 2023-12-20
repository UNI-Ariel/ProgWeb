const controller = require('../controllers/publicController');
const { Router } = require('express');

const router = Router();


router.get('/', controller.index_page);

router.get('/login', controller.login_page);

router.post('/login', controller.login_request);

router.get('/search', controller.search_page);

router.get('/forbidden', controller.forbidden_page);

router.get('/api/info', controller.api_info);

router.get('/api/search', controller.api_search);

module.exports = router;