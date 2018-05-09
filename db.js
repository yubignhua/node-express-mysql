/**
 * Created by yubh on 2018/2/5.
 */
const Sequelize = require('sequelize');
const fs = require("fs");
const path = require('path');

let db = null;
module.exports = app =>{
    "use strict";
    if(!db){
        //获取配置信息
        const config = app.config;
        //初始化 sequelize 连接数据库
        const sequelize = new Sequelize(
            config.db,
            config.username,
            config.password,
            config.params
        );
        db = {
            Sequelize,
            sequelize,
            models: {}
        };
        //获取数据库模型文件存放路径
        const dir = path.join(__dirname,'models');
        fs.readdirSync(dir).forEach(file=>{
            //获取数据库模型文件路径
            const modelDir = path.join(dir,file);
            //导入数据库模型文件并存放到 db.models 对象中
            const model = sequelize.import(modelDir);
            db.models[model.name] = model;
        });

        Object.keys(db.models).forEach(key =>{
            //console.log('--hahah',key);
            //console.log('associate::',db.models[key].associate);
            //console.log('db.models::',db.models);
            db.models[key].associate(db.models);

        })


    }
    
    return db;

};

