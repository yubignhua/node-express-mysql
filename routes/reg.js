/**
 * Created by yubh on 2018/1/29.
 */
var express = require('express');
var router = express.Router();
// const ConnectMongo = require('../models/db');
// ConnectMongo();

/* GET home page. */
router.get('/reg', function(req, res,next) {
    res.render('reg', { title: '注册' });
});

module.exports = router;/**
 * Created by yubh on 2018/1/29.
 */
