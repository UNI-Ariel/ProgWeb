const { Router } = require('express');

const router = Router();

router.all( '/api/*', (req, res) =>{
    res.status(404).json({code:"404", body: "Not Found."});
});

router.all( '*', (req, res) =>{
    const page_param = {title: '404'};
    if(req.session.logged){
        page_param['logged'] = true;
        page_param['userData'] = req.session.userData;
    }
    res.status(404).render('404', page_param);
});

module.exports = router;