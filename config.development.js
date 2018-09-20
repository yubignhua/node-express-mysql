/**
 * Created by yubh on 2018/2/5.
 */

module.exports = {
    username: "root",
    password: "123456",
    cookieSecret: 'yubh',
    db:'yubh_db',
    host:'localhost',
    port:3004,
    url:'mongodb://localhost:27017',
    params:{
        host: 'localhost',
        dialect: 'mysql',
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
