/**
 * Created by yubh on 2018/2/7.
 */
const jwt = require('jwt-simple');
module.exports = (app) =>{
    'use strict'
    const cfg = app.config;
    const Users = app.db.models.Users;
    
    app.post('/test/token',(req,res)=>{
        //console.log('req.body::::',req.body);
        console.log('req.session.user=======',req.session);
        const email = req.body.email;
        const password = req.body.password;
        if(email && password){
            Users.findOne({
                where:{email:email}
            }).then(user =>{
                console.log('user::::',user.password);
                if(Users.isPassword(user.password,password)){
                    const payload = {id:user.id};
                    res.json({
                        token:jwt.encode(payload,cfg.jwtSecret)
                    })
                }else{
                    res.sendStatus(401)
                }
            }).catch(error => res.sendStatus(401) )
            
        }else{
            res.sendStatus(401);
        }
    })
};