module.exports = () => {
  //引入路由配置
  var home = require('./home');//主页
  var login = require('./login');//登录页
  var reg = require('./reg');//登录页
  var getUserData = require('./getUserData');
  var users = require('./users');
  var others = require('./others');


  // 应用路由配置
  app.use('/', home);
  app.use('/', login);
  app.use('/', reg);
  app.use('/getData',getUserData);
  app.use('/users', users);
  app.use('/others',others);


};
