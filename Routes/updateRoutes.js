var express = require('express');

var routes = function (User, Book, Update) {
	var updateRouter = express.Router();

	var updateController = require('../Controllers/updateController')(User, Book, Update);

	updateRouter.route('/')
		.get(updateController.get);

	updateRouter.use('/:updateId', function (req, res, next) {
		Update.findById(req.params.updateId, function (err, update) {
			if (err) {
				res.status(500).send(err);
			} else if (update) {
				req.update = update;
				next();
			} else {
				res.status(404).send('no update found');
			}
		});
	});

	updateRouter.route('/:updateId')
		.put(function (req, res) {
			var user = req.user;

			if (!user) {
				res.status(401);
				res.json({
					message: 'Unauthorized user'
				});
				return;
			}

			var updateId = req.params.updateId;

			Update.findById(updateId, function (err, update) {
				if (err) {
					// res.status(500).json(err);
					throw err;
				}
				if (!update) {
					res.status(404).json({
						message: 'No update found'
					});
					return;
				}
				if (!update.likes) {
					update.likes = [];
				}
				update.likes.push({

					userId: user._id,
				});
				update.save(function () {
					var newUpdate = new Update({
						text: user.username + ' liked ' + update.user.username + '\'s status',
						date: new Date(),
						user: {
							username: user.username,
							id: user._id
						},
						likes: {
							userId: user._id,
						}
					});
					newUpdate.save();
					res.json({
						result: update
					});
				});
			});
		});

	updateRouter.route('/:updateId/comment')
		.put(function (req, res) {
			var user = req.user;

			if (!user) {
				res.status(401);
				res.json({
					message: 'Unauthorized user'
				});
				return;
			}

			var updateId = req.params.updateId;
			var comment = req.body.comment;
			Update.findById(updateId, function (err, update) {
				if (err) {
					// res.status(500).json(err);
					throw err;
				}
				if (!update) {
					res.status(404).json({
						message: 'No update found'
					});
					return;
				}
				if (!update.comments) {
					update.comments = [];
				}
				update.comments.push({

					userId: user._id,
					comment: comment
				});
				update.save(function () {
					var newUpdate = new Update({
						text: user.username + ' commented ' + update.user.username + '\'s status',
						date: new Date(),
						user: {
							username: user.username,
							id: user._id
						},
						comments: {
							userId: user._id,
							comment: comment
						}
					});
					newUpdate.save();
					res.json({
						result: update
					});
				});
			});
		});


	return updateRouter;
};

module.exports = routes;