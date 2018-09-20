/**
 * Created by yubh on 2018/2/8.
 */
const fs = require('fs');
const winston = require('winston');
//console.log('winston=====',winston)

if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs");
}

module.exports = new winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            level: "info",
            filename: "logs/app.log",
            maxsize: 1048576,
            maxFiles: 10,
            colorize: false
        })
    ]
});