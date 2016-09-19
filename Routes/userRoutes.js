var express = require('express');

var routes = function (User) {
    var userRouter = express.Router();

    var userController = require('../Controllers/userController')(User);

    userRouter.route('/')
        .post(userController.post)
        .get(userController.get);

    userRouter.route('/auth')
        .put(function (req, res) {
            var username = req.body.username,
                passHash = req.body.passHash,
                query = {
                    username: username.toLowerCase()
                };

            User.findOne(query, function (err, user) {
                
                if (err) {
                    throw err;
                } else if (user === null) {

                // console.log('Here must reload login page and clear inputs');
                    res.status(404).json({
                        message: 'Invalid username or password'
                    });

                } else if (user.passHash === passHash) {
                    var userSend = {
                        username: user.nickname,
                        authKey: user.authKey
                    };

                    res.json(userSend);
                } else {
                    res.status(404).json({
                        message: 'Invalid username or password'
                    });
                }
            });

        });

    userRouter.use('/:userId', function (req, res, next) {
        User.findById(req.params.userId, function (err, user) {
            if (err) {
                res.status(500).send(err);
            } else if (user) {
                req.user = user;
                next();
            } else {
                res.status(404).send('no user found');
            }
        });
    });

    userRouter.route('/:userId')
        .get(function (req, res) {
            var returnUser = req.user.toJSON();

            returnUser.links = {};
            res.json(returnUser);
        })
        .put(function (req, res) {
            if (req.body._id) {
                delete req.body._id;
            }
            for (var p in req.body) {
                req.user.p = req.body[p];
            }
            req.user.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.user);
                }
            });
        })
        .delete(function (req, res) {
            req.user.remove(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(204).send('Removed');
                }
            });
        });

    return userRouter;
};

module.exports = routes;