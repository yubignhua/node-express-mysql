/**
 * Created by yubh on 2018/2/7.
 */
//import bcrypt from "bcrypt"
const bcrypt = require('bcrypt');
module.exports = (sequelize,DataType)=>{
    'use strick'
    const Users = sequelize.define('Users',{
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        password: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataType.STRING,
            unique: true,
            allowNull: true,
            defaultValue: '981842762@qq.com',
           
        }
        
    },{
        hooks:{
            beforeCreate: user => {
                const salt = bcrypt.genSaltSync();
                user.password = bcrypt.hashSync(user.password, salt);
            }
        }
    });

    Users.associate = (models) => {
        Users.hasMany(models.Tasks);
    };
    Users.isPassword = (encodedPassword, password) => {
        //比较原密码与库里存的hash密码是否相等
        return bcrypt.compareSync(password, encodedPassword);
    };

    return Users

};

