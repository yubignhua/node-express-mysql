/**
 * Created by yubh on 2018/2/5.
 */

module.exports = {
  username: "root",//数据库的用户名称
  password: "123456",//登录数据库密码(本地数据库)
  db:'yubh_db',//数据库名(本地数据库)
  url:'mongodb://localhost:27017',
  params:{ //使用连接池连接
        host: 'localhost',//(本地数据库)
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
host : 'localhost',//主机名
port : 3004,//本地主机端口号
cookieSecret : 'yubh',
jwtSecret : "asdfsafsafsafsafsafsafsafd",
jwtSession : {session : false}

};
