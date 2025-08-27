/**
 * Created by yubh on 2018/2/5.
 */

module.exports = {
    username: "reat_express_yubh",//数据库的用户名称
    //password: "123456",//登录数据库密码(本地数据库)
    password: "Yu1988001@123",//登录数据库密码(远程数据库)
    // db:'yubh_db',//数据库名(本地数据库)
    db:'familyDB',//数据库名(远程数据库)
    url:'mongodb://localhost:27017',
    params:{ //使用连接池连接
          host: '149.88.88.205',//链接数据库的主机(远程数据库)
          port: 3306,//连接数据库的端口(远程数据库)
          dialect: 'mysql',//链接数据库的名称
          dialectOptions: {
            charset: 'utf8mb4',
            connectTimeout: 60000
          },
        // pool configuration used to pool database connections
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        retry: {
            match: [
                /ETIMEDOUT/,
                /EHOSTUNREACH/,
                /ECONNRESET/,
                /ECONNREFUSED/,
                /ESOCKETTIMEDOUT/,
                /EPIPE/,
                /EAI_AGAIN/,
                /SequelizeConnectionError/,
                /SequelizeConnectionRefusedError/,
                /SequelizeHostNotFoundError/,
                /SequelizeHostNotReachableError/,
                /SequelizeInvalidConnectionError/,
                /SequelizeConnectionTimedOutError/
            ],
            max: 3
        },

    },
	host : 'localhost',//主机名
	 port : 3004,//主机端口号
	//port : 80,//主机端口号
	cookieSecret : 'yubh',
	jwtSecret : "asdfsafsafsafsafsafsafsafd",
	jwtSession : {session : false}

};
