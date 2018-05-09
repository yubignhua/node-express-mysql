/**
 * Created by yubh on 2018/1/29.
 */
var express = require('express');
var router = express.Router();

var query=require("../libs/mysql_pool");
/* GET home page. */
router.get('/', function(req, res, next) {
    //从数据库获取数据
    query('select * from persons',function (err,results,fields) {
        console.log('hahah----',results);
        res.json(results);
    });
});

module.exports = router;