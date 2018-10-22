/**
 * Created by yubh on 2018/2/5.
 */
const express = require("express");
const consign = require("consign");
const app = express();
console.log("process.cwd():", process.cwd());

/// 在使用include或者then的时候，是有顺序的，如果传入的参数是一个文件夹
/// 那么他会按照文件夹中文件的顺序进行加载
consign({
  verbose: false,
  cwd: "server"
}).include("./config/config.js")
  .then("db.js")
  .then("auth.js")
  .then("middlewares.js")
  .then("../routers")
  .then("boot.js")
  .into(app);
module.exports = app;
