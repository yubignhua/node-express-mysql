const express = require('express')
const router = express.Router();
const debug = require('debug')('express:server');


router.get('/:name', function (req, res) {
    res.locals.name = req.params.name;
    //console.log('>>>>>>>> req:::',res);
    //console.log('>>>>>>>> res:::',res);

    res.render('users',{
        old:18
    })
});

module.exports = router;

