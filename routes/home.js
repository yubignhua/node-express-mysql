/**
 * Created by yubh on 2018/1/29.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/home', function(req, res, next) {
    res.render('index');
});

module.exports = router;