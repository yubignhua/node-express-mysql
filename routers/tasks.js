/**
 * Created by M.C on 2017/9/15.
 */

module.exports = app => {
    "use strict";
    const Tasks = app.db.models.Tasks;

    app.route("/test/tasks")
        //.all(app.auth.authenticate())
        /**
         * @api {get} /tasks List the user's tasks
         * @apiGroup Tasks
         * @apiHeader {String} Authorization Token of authenticated user
         * @apiHeaderExample {json} Header
         *  {
         *      "Authorization": "xyz.abc.123.hgf"
         *  }
         * @apiSuccess {Object[]} tasks Task list
         * @apiSuccess {Number} tasks.id Task id
         * @apiSuccess {String} tasks.title Task title
         * @apiSuccess {Boolean} tasks.done Task is done?
         * @apiSuccess {Date} tasks.updated_at Update's date
         * @apiSuccess {Date} tasks.created_at Register's date
         * @apiSuccess {Number} tasks.user_id The id for the user's
         * @apiSuccessExample {json} Success
         *  HTTP/1.1 200 OK
         *  [{
         *      "id": 1,
         *      "title": "Study",
         *      "done": false,
         *      "updated_at": "2016-02-10T15:46:51.778Z",
         *      "created_at": "2016-02-10T15:46:51.778Z",
         *      "user_id": 1
         *  }]
         * @apiErrorExample {json} List error
         *  HTTP/1.1 412 Precondition Failed
         */
        .get((req, res) => {
            console.log(`req.body: ${req.body}`);
            Tasks.findAll({where: {user_id: req.user.id} })
                .then(result => res.json(result))
                .catch(error => {
                    res.status(412).json({msg: error.message});
                });
        })

        /**
         * @api {post} /tasks Register a new task
         * @apiGroup Tasks
         * @apiHeader {String} Authorization Token of authenticated user
         * @apiHeaderExample {json} Header
         *  {
         *      "Authorization": "xyz.abc.123.hgf"
         *  }
         * @apiParam {String} title Task title
         * @apiParamExample {json} Input
         *  {"title": "Study"}
         * @apiSuccess {Number} id Task id
         * @apiSuccess {String} title Task title
         * @apiSuccess {Boolean} done Task is done?
         * @apiSuccess {Date} updated_at Update's date
         * @apiSuccess {Date} created_at Register's date
         * @apiSuccess {Number} user_id The id for the user's
         * @apiSuccessExample {json} Success
         *  HTTP/1.1 200 OK
         *  {
         *      "id": 1,
         *      "title": "Study",
         *      "done": false,
         *      "updated_at": "2016-02-10T15:46:51.778Z",
         *      "created_at": "2016-02-10T15:46:51.778Z",
         *      "user_id": 1
         *  }
         * @apiErrorExample {json} List error
         *  HTTP/1.1 412 Precondition Failed
         */
        .post((req, res) => {
            console.log('req.body===',req.body);
            //req.body.user_id = req.body.id;
            console.log('req.body===',req.body);

            Tasks.create(req.body)
                .then(result => res.json(result))
                .catch(error => {
                    res.status(412).json({msg: error.message});
                });
        });

    app.route("/tasks/:id")
        .all(app.auth.authenticate())

        /**
         * @api {get} /tasks/:id get a task
         * @apiGroup Tasks
         * @apiHeader {String} Authorization Token of authenticated user
         * @apiHeaderExample {json} Header
         *  {
         *      "Authorization": "xyz.abc.123.hgf"
         *  }
         * @apiParam {id} id Task id
         * @apiSuccess {Number} id Task id
         * @apiSuccess {String} title Task title
         * @apiSuccess {Boolean} done Task is done?
         * @apiSuccess {Date} updated_at Update's date
         * @apiSuccess {Date} created_at Register's date
         * @apiSuccess {Number} user_id The id for the user's
         * @apiSuccessExample {json} Success
         *  HTTP/1.1 200 OK
         *  {
         *      "id": 1,
         *      "title": "Study",
         *      "done": false,
         *      "updated_at": "2016-02-10T15:46:51.778Z",
         *      "created_at": "2016-02-10T15:46:51.778Z",
         *      "user_id": 1
         *  }
         * @apiErrorExample {json} Task not found error
         *  HTTP/1.1 404 Not Found
         * @apiErrorExample {json} Find error
         *  HTTP/1.1 412 Precondition Failed
         */
        .get((req, res) => {
            Tasks.findOne({where: {
                    id: req.params.id,
                    user_id: req.user.id
                }})
                .then(result => {
                    if (result) {
                        res.json(result);
                    } else {
                        res.sendStatus(412);
                    }
                })
                .catch(error => {
                    res.status(412).json({msg: error.message});
                });
        })

        /**
         * @api {put} /tasks/:id update a task
         * @apiGroup Tasks
         * @apiHeader {String} Authorization Token of authenticated user
         * @apiHeaderExample {json} Header
         *  {
         *      "Authorization": "xyz.abc.123.hgf"
         *  }
         * @apiParam {id} id Task id
         * @apiParam {String} title Task title
         * @apiParam {Boolean} done Task is done?
         * @apiParamExample {json} Input
         *  {
         *      "title": "Study",
         *      "done": true,
         *  }
         * @apiSuccessExample {json} Success
         *  HTTP/1.1 404 Not Found
         * @apiErrorExample {json} Update error
         *  HTTP/1.1 412 Precondition Failed
         */
        .put((req, res) => {
            Tasks.update(req.body, {where: {
                    id: req.params.id,
                    user_id: req.user.id
                }})
                .then(result => res.sendStatus(204))
                .catch(error => {
                    res.status(412).json({msg: error.message});
                });
        })

        /**
         * @api {delete} /tasks/:id delete a task
         * @apiGroup Tasks
         * @apiHeader {String} Authorization Token of authenticated user
         * @apiHeaderExample {json} Header
         *  {
         *      "Authorization": "xyz.abc.123.hgf"
         *  }
         * @apiParam {id} id Task id
         * @apiSuccessExample {json} Success
         *  HTTP/1.1 204 Not Content
         * @apiErrorExample {json} Delete error
         *  HTTP/1.1 412 Precondition Failed
         */
        .delete((req, res) => {
            Tasks.destroy({where: {
                    id: req.params.id,
                    user_id: req.user.id
                }})
                .then(result => res.sendStatus(204))
                .catch(error => {
                    res.status(412).json({msg: error.message});
                });
        });
};