/**
 * Created by yubh on 2018/2/3.
 */
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'me',
    password : 'secret',
    database : 'yubh_db'
});

const getPersonsTable = 'select * from persons';
connection.query(getPersonsTable,function (err,result,fields) {
    if(err) throw error;
    console.log('result::',result);
    connection.end();

});