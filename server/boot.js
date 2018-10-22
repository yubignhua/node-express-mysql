
//const fs = require("fs");
//const https = require("https");
const http = require('http');
const path = require('path');
const ejs = require('ejs');


module.exports = (app)=>{
    "use strict";
    //设置 dist 文件夹为存放视图文件的目录, 即存放模板文件的地方,__dirname 为全局变量,存储当前正在执行的脚本所在的目录
    app.set('views', path.join(__dirname, 'dist'));
    //设置返回原始 html 页面
    app.set('view engine', 'html');
    app.engine('html', ejs.renderFile);
    //获取配置信息
    const cfg = app.config.config;
    //设置端口号
    const port = normalizePort(cfg.port || '3001');
    app.set('port', port);
  
	app.db.sequelize.sync().done(()=>{//同步所有已定义的模型到数据库中成功后的回调
        const server = http.createServer(app).listen(app.get("port"), () => {
	    const address = server.address();
          console.log(`SERVER LISTENING TO PORT:http://${cfg.host}:${app.get('port')}>>>>>>>>>>>>>>>>(SERVER START)>>>>>>>>>>>>>>>>>>>>>`);
        });
    });
    

};

function normalizePort(val){
    var port = parseInt(val, 10);
    //console.log('port::::',port);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}



/*
 https请求设置
 const credentials = {
 key: fs.readFileSync("44885970_www.localhost.com.key", "utf8"),
 cert: fs.readFileSync("44885970_www.localhost.com.cert", "utf8")
 };
 https.createServer(credentials,app).listen(app.get("port"), () => {
 console.log('SERVER LISTENING TO PORT:'+ app.get('port')+' yubh: >>>>>>>>>>>>>>>>(SERVER START)>>>>>>>>>>>>>>>>>>>>>');
 });
 */