var express = require('express');

var routes = function (User, Book, Update) {
	var myBooksRouter = express.Router();

	var myBooksController = require('../Controllers/myBooksController')(User, Book, Update);
	myBooksRouter.route('/')
		.get(myBooksController.get)
		.put(myBooksController.put);


	myBooksRouter.route('/all')
		.get(function (req, res) {
			var user = req.user;
			if (!user) {
				res.status(401);
				res.json({
					message: 'Unauthorized user'
				});
				return;
			}
			var books = user.booksToRead.concat(user.booksCurrentlyReading).concat(user.booksRead);

			var bookIds = books.map(function (book) {
				return book._id;
			});

			Book.find({
				_id: {
					"$in": bookIds
				}
			}, function (err, dbBooks) {
				if (err) {
					throw err;
				}

				books.sort(function (b1, b2) {
					var id1 = b1._id.toString(),
						id2 = b2._id.toString();
					return id1.localeCompare(id2);
				});

				dbBooks.sort(function (b1, b2) {
					var id1 = b1._id.toString(),
						id2 = b2._id.toString();
					return id1.localeCompare(id2);
				});

				var statusMaps = {
					booksRead: 'read',
					booksToRead: 'want-to-read',
					booksCurrentlyReading: 'currently-reading'
				};
				var resBooks = [];
				for (var i = 0; i < books.length; i += 1) {


					var dbBook = dbBooks[i];
					if (!dbBook) {
						continue;
					}
					resBooks.push({
						_id: dbBook._id,
						title: dbBook.title,
						author: dbBook.author,
						genres: dbBook.genres,
						description: dbBook.description,
						pages: dbBook.pages,
						coverUrl: dbBook.coverUrl,
						status: statusMaps[books[i].status]
					});
				}
				resBooks.sort(function (b1, b2) {
					var title1 = b1.title.toString(),
						title2 = b2.title.toString();
					return title1.localeCompare(title2);
				});

				res.json(resBooks);
			});
		});

	myBooksRouter.route('/to-read')
		.get(function (req, res) {
			var user = req.user;
			if (!user) {
				res.status(401);
				res.json({
					message: 'Unathorized user'
				});
				return;
			}

			var books = user.booksToRead;

			var bookIds = books.map(function (book) {
				return book.id;
			});

			Book.find({
				_id: {
					"$in": bookIds
				}
			}, function (err, books) {
				if (err) {
					throw err;
				}
				res.json(books);
			});
		});

	myBooksRouter.route('/currently-reading')
		.get(function (req, res) {
			var user = req.user;
			if (!user) {
				res.status(401);
				res.json({
					message: 'Unathorized user'
				});
				return;
			}

			var books = user.booksCurrentlyReading;

			var bookIds = books.map(function (book) {
				return book.id;
			});

			Book.find({
				_id: {
					"$in": bookIds
				}
			}, function (err, books) {
				if (err) {
					throw err;
				}
				res.json(books);
			});
		});


	myBooksRouter.route('/read')
		.get(function (req, res) {
			var user = req.user;
			if (!user) {
				res.status(401);
				res.json({
					message: 'Unathorized user'
				});
				return;
			}

			var books = user.booksRead;

			var bookIds = books.map(function (book) {
				return book.id;
			});

			Book.find({
				_id: {
					"$in": bookIds
				}
			}, function (err, books) {
				if (err) {
					throw err;
				}
				res.json(books);
			});
		});



	return myBooksRouter;
};

module.exports = routes;