/**
 * Created by yubh on 2018/2/5.
 */
module.exports = app => {
    "use strict";
    const env = process.env.NODE_ENV;
    if (env) {
        return require(`./config.${env}.js`);
    }
    return require("./config.local.js");
};