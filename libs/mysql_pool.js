/**
 * Created by yubh on 2018/2/3.
 */
const mysql=require("mysql");
const pool = mysql.createPool({
    host     : 'localhost',
    user     : 'me',
    password : 'secret',
    database : 'yubh_db'
});

const query=function(sql,callback,options){
    pool.getConnection(function(err,connection){
        if(err){
            callback(err,null,null);
        }else{
            connection.query(sql,options,function(err,results,fields){
                //释放连接  
                connection.release();
                //事件驱动回调  
                callback(err,results,fields);
            });
        }
    });
};

module.exports=query;  