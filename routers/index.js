/**
 * Created by yubh on 2018/2/7.
 */
module.exports = app => {
  "use strict";
  const cfg = app.config;
  const Users = app.db.models.Users;
  app.get("/test/name", (req, res) => {
    console.log("req.session.user=======", req.body);
    const email = req.body.email;
    const password = req.body.password;
    res.json({
      name: 'yubinghua',
      role:'admin'
    });
    //res.sendStatus(401);
  });
};
