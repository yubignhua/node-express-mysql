/**
 * Created by yubh on 2018/2/3.
 */
const mysql=require("mysql2");
const pool = mysql.createPool({
    host     : '149.88.88.205',
    user     : 'reat_express_yubh',
    password : 'Yu1988001@123',
    database : 'familyDB',
    port     : 3306,
    connectionLimit: 10,
    reconnect: true,
    insecureAuth: true
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