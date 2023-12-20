const { Router } = require('express');

const router = Router();

router.all( '*', (req, res) =>{
    const page_param = {title: '404'};
    if(req.session.logged){
        page_param['logged'] = true;
        page_param['userData'] = req.session.userData;
    }
    res.render('404', page_param);
});

module.exports = router;