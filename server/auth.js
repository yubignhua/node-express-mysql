const passport = require('passport');
const passportMap = require('passport-jwt');
const Strategy = passportMap.Strategy;
const ExtractJwt = passportMap.ExtractJwt;

module.exports = app => {
    const Users = app.db.models.Users;
    const cfg = app.config.config;
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("JWT");
    opts.secretOrKey = cfg.jwtSecret;
    console.log('opts======',opts)
    const strategy = new Strategy(opts, (payload, done) => {
        console.log('=======payload============',payload);
        Users.findById(payload.id)
            .then(user => {
                if (user) {
                    return done(null, {
                        id: user.id,
                        email: user.email
                    });
                }
                return done(null, false);
            }).catch(error => done(error, null));
    });
    passport.use(strategy);

    return {
        //初始化授权方法 => 服务初始化的时候调用
        initialize: () => {
            return passport.initialize();
        },
        //授权验证方法 => http api 请求时调用
        authenticate: () => {
            console.log('=======authenticate============')
            return passport.authenticate("jwt", cfg.jwtSession);
        }
    };
};
