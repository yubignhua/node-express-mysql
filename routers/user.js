/**
 * Created by yubh on 2018/2/7.
 */
module.exports = app =>{
    "use strict";
    const Users = app.db.models.Users;


    app.route('/test/user')
        .all(app.auth.authenticate())
        .post((req,res)=>{
            //获取 get请求参数 req.query
            console.log('query::::',req.query);
            res.json({});
            //Users.findById()
        });

    /**
     * 用户登录
     */
    app.post('/test/login',(req,res)=>{
            //获取 get请求参数 req.query
            console.log('req.body::::',req.body);
            Users.findById(req.body.id,{
                attributes:['id','name','email']
            })
                .then(result => {
                    if(result){
                        console.log('result===',result.dataValues);
                        result.dataValues["old"] = 18;
                        result.dataValues["like"] = ['basketball','football','tebaltenis'];
                        res.json(result)
                    }else{
                        res.json([])
                    }
                })
                .catch(error => {
                    res.status(412).json({msg:error.message})
                })
        });

    /**
     * 注册用户
     */
    app.post('/test/users',(req,res)=>{
        console.log('req====',req.body);
        //存储数据
        Users.create(req.body)
            .then(result => res.json({msg:'注册成功'}))
            .catch(error => {
                res.status(412).json({msg: error.message});
            });
    });

    /**
     * 获取全部用户列表
     */
    app.get('/test/users',(req,res)=>{
        //console.log('req.session.user:::::',req.session);
        //console.log('res.session.user:::::',req.session);
        //console.log('req.cookies:::::',req.cookies);
        if(req.headers.cookie){
            console.log('解析前的headers：' + req.headers);
            console.log('解析前的cookie：' + req.headers.cookie);
        };
        var visit = req.cookies.visit || 0; // 讀取cookie
        console.log('解析前的cookies.visit',visit)

        Users.findAll().then(userList=>{
            //console.log(userList);
            var user={
                name:"Chen-xy",
                age:"22",
                address:"bj"
            }
            req.session.user=user;
            res.json(userList);
            //res.redirect('/football');

        }).catch(err =>{
            res.status(412).json({msg:err.message})
        })
    })
};