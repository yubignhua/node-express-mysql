/**
 * Created by yubh on 2018/1/29.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login', function(req, res,next) {
    res.render('login', { title: '登录' });
});

module.exports = router;