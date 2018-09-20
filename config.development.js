/**
 * Created by yubh on 2018/2/5.
 */

module.exports = {
    username: "root",//数据库的用户名称
    //password: "123456",//登录数据库密码
    password: "Yubh@123",//登录数据库密码
    cookieSecret: 'yubh',
    // db:'yubh_db',//数据库名
    db:'reat_express_yubh',//数据库名
    host:'localhost',
    port:3004,
    url:'mongodb://localhost:27017',
    params:{ //使用连接池连接
          // host: 'localhost',
          host: '116.85.54.213',//链接数据库的主机
          port:'3306',//连接数据库的端口
          dialect: 'mysql',//链接数据库的名称
          dialectOptions: {
            charset: 'utf8mb4'
          },
        // pool configuration used to pool database connections
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        operatorsAliases: false
    },
    jwtSecret: "asdfsafsafsafsafsafsafsafd",
    jwtSession: {session: false}

};
