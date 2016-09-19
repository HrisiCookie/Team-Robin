require('../polyfills/array');

var updateController = function (User, Book, Update) {
	var get = function (req, res) {
		var page = req.query.page || 1,
			size = req.query.size || 10;


		Update.find({}, function (err, updates) {
			if (err) {
				res.status(500).send(err);
			} else {
				updates.sort(function (b1, b2) {
					var date1 = b1.date,
						date2 = b2.date;
					return date2 - date1;
				});
				updates = updates.slice((page - 1) * size, page * size);

				updates = updates.map(function (update) {


					return {
						_id: update._id,
						text: update.text,
						date: update.date,
						user: update.user.username,
						book: update.book,
						review: update.review,
						rating: update.rating,
						likes: update.likes ? update.likes.length : 0,
						comments: update.comments ? update.comments : null

					};
				});

				res.json(updates);
			}
		});
	};

	return {
		get: get
	};
};


module.exports = updateController;