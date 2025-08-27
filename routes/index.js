module.exports = (app) => {
  //引入路由配置
  var home = require('./home');//主页
  var login = require('./login');//登录页
  var reg = require('./reg');//登录页
  var getUserData = require('./getUserData');
  var users = require('./users');
  var others = require('./others');
  var blog = require('./blog');//博客路由
  var portfolio = require('./portfolio');//作品集路由
  var projects = require('./projects');//项目路由
  var particles = require('./particles');//粒子系统路由
  var github = require('./github');//GitHub集成路由
  var ai = require('./ai');//AI服务路由

  // 应用路由配置
  app.use('/', home);
  app.use('/', login);
  app.use('/', reg);
  app.use('/getData',getUserData);
  app.use('/users', users);
  app.use('/others',others);
  app.use('/api/blog', blog);
  app.use('/api/portfolio', portfolio);
  app.use('/api/projects', projects);
  app.use('/api/particles', particles);
  app.use('/api/github', github);
  app.use('/api/ai', ai);
};
