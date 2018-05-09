/**
 * Created by yubh on 2018/1/29.
 */
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const debug = require('debug')('express:server');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const settings = require('./setting');

//引入路由配置
var home = require('./routes/home');//主页
var login = require('./routes/login');//登录页
var reg = require('./routes/reg');//登录页
var getUserData = require('./routes/getUserData');
var users = require('./routes/users');
var others = require('./routes/others');
//实例化 express
var app = express();


//设置 views 文件夹为存放视图文件的目录, 即存放模板文件的地方,__dirname 为全局变量,存储当前正在执行的脚本所在的目录
//app.set('views', path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, 'dist'));

//设置视图模板引擎为 ejs。
//app.set('view engine', 'ejs');

//设置返回原始 html 页面
app.set('view engine', 'html');
app.engine('html',ejs.renderFile);

//设置端口号
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// uncomment after placing your favicon in /public  设置/public/favicon.ico为favicon图标
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));//加载日志中间件
app.use(bodyParser.json());//加载解析json的中间件
app.use(bodyParser.urlencoded({ extended: false }));//加载解析urlencoded请求体的中间件
app.use(cookieParser());//加载解析cookie的中间件
//app.use(express.static(path.join(__dirname, 'public')));//设置public文件夹为存放静态文件的目录
app.use(express.static(path.join(__dirname, 'dist')));//设置public文件夹为存放静态文件的目录

//向数据库存储 sesstion 信息
// app.use(session({
//     secret: settings.cookieSecret,
//     key: settings.db,//cookie name
//     cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
//     store: new MongoStore({
//         db: settings.db,
//         host: settings.host,
//         port: settings.port,
//         url: 'mongodb://localhost/blog'
//     })
// }));

// 应用路由配置
app.use('/', home);
app.use('/', login);
app.use('/', reg);
app.use('/getData',getUserData);
app.use('/users', users);
app.use('/others',others);

// catch 404 and forward to error handler  捕获404错误，并转发到错误处理器。
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler 错误处理器，将错误信息渲染error模版并显示到浏览器中。(13)
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val){
    var port = parseInt(val, 10);
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

//监听端口并启动 node 服务
app.listen(app.get('port'), function() {
    console.log('SERVER LISTENING TO PORT:'+ app.get('port')+' yubh: >>>>>>>>>>>>>>>>(SERVER START)>>>>>>>>>>>>>>>>>>>>>');
});
module.exports = app;

