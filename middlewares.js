/**
 * Created by yubh on 2018/2/5.
 */
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const debug = require('debug')('express:server');
const session = require('express-session');
const morgan = require('morgan');
const logger = require("./logger");
const cors =  require("cors");
const compression = require('compression');
const helmet = require('helmet');
const connectHistoryApiFallback = require('connect-history-api-fallback');

const MongoStore = require('connect-mongo')(session);





module.exports = (app)=> {
    
    /*
    设置/public/favicon.ico为favicon图标
    app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    */

    //加载日志中间件打印日志方法一
    app.use(morgan('dev'));

    /*
        //打印日志方法二
        app.use(morgan("common", {
            stream: {
                write: (message) => {
                    //console.log('----234--',logger);
                    //logger.info('Hello again distributed logs')
                    logger.info(message);
                }
            }
        }));
       */
    //对数据进行了gzip压缩
    app.use(compression());
    //帮助设置 http header
    app.use(helmet());
    //加载解析json的中间件
    app.use(bodyParser.json());
    //初始化授权方法
    app.use(app.auth.initialize());
    //加载解析urlencoded请求体的中间件
    app.use(bodyParser.urlencoded({extended: false}));
    //加载解析cookie的中间件
    app.use(cookieParser(app.config.cookieSecret));
    // 由js控制路由后端不做页面路由配置，一定要写在express.static前面！！！
    app.use('/', connectHistoryApiFallback());
    //app.use(connectHistoryApiFallback());
    //设置dist文件夹为存放静态文件的目录
    app.use(express.static(path.join(__dirname, 'dist')));
        app.use(session({
            secret: app.config.cookieSecret,//作为服务器端生成session的签名 用来对session id相关的cookie进行签名
            key: app.config.db,//cookie name
            cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//cookie 报错最大期限为 30 days
            resave: false,
            saveUninitialized: false
            /*store: new MongoStore({  //向数据库存储 sesstion 信息
                db: settings.db,
                host: settings.host,
                port: settings.port,
                url: 'mongodb://localhost/blog'
            })*/
        }));

    //设置能访问接口的域名,http 方法
    app.use(cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }));

    // //捕获404错误，并转发到错误处理器。
    // app.use(function(req, res, next) {
    //     var err = new Error('Not Found');
    //     err.status = 404;
    //     next(err);
    // });
    //
    //
    // //错误处理器，将错误信息渲染error模版并显示到浏览器中。(13)
    // app.use(function(err, req, res, next) {
    //     // set locals, only providing error in development
    //     res.locals.message = err.message;
    //     res.locals.error = req.app.get('env') === 'development' ? err : {};
    //     res.status(err.status || 500);
    //     res.render('error');
    // });
};

