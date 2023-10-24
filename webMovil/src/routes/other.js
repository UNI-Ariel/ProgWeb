const { Router } = require('express');

const router = Router();

router.all( '*', (req, res) =>{
    res.render('404', {title: '404'});
});

module.exports = router;