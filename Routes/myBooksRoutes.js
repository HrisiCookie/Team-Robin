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
			//WTF???????????
			//res.json(books);
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
				return book._id;
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
			//res.json(books);
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
				return book._id;
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
			//res.json(books);
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
				return book._id;
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
			//res.json(books);
		});


	myBooksRouter.route('/review')
		.put(function (req, res) {
			var user = req.user;
			if (!user) {
				res.status(401);
				res.json({
					message: 'Unathorized user'
				});
				return;
			}
			var rating = req.body.rating | 0;
			if (isNaN(rating) || rating < 1 || 5 < rating) {
				res.status(404);
				res.json({
					message: 'Invalid rating'
				});
				return;
			}

			var review = req.body.review;

			var bookId = req.body.bookId;
			if (!bookId) {
				res.status(404);
				res.json({
					message: "Invalid book"
				});
				return;
			}

			Book.findById(bookId, function (err, book) {
				if (err) {
					throw err;
				}
				if (!book) {
					res.status(404).json({
						message: 'No book found'
					});
					return;
				}

				if (!book.rating) {
					book.ratings = [];
				}
				var index = book.ratings.findIndex(function (userRating) {
					return userRating.userId.toString() === user._id.toString();
				});
				if (index >= 0) {
					book.ratings[index].rating = rating;
				} else {
					book.ratings.push({
						userId: user._id,
						username: user.username,
						rating: rating
					});
				}

				if (!book.reviews) {
					book.reviews = [];
				}

				book.reviews.push({
					userId: user._id,
					username: user.username,
					review: review
				});



				book.save(function () {
					var newUpdate = new Update({
						text: user.username + ' added review for ' + book.title,
						date: new Date(),
						user: {
							username: user.username,
							id: user._id
						},
						book: {
							_id: book.id,
							title: book.title,
						},
						review: review,
						rating: rating
					});

					newUpdate.save(function (err, update) {

						res.json({
							result: book
						});
					});

				});
			});
		});

	myBooksRouter.route('/progress')
		.put(function (req, res) {
			var user = req.user;
			if (!user) {
				res.status(401);
				res.json({
					message: 'Unathorized user'
				});
				return;
			}

			var review = req.body.review;
			var progress = req.body.progress;
			var bookId = req.body.bookId;
			if (!bookId) {
				res.status(404);
				res.json({
					message: "Invalid book"
				});
				return;
			}

			Book.findById(bookId, function (err, book) {
				if (err) {
					throw err;
				}
				if (!book) {
					res.status(404).json({
						message: 'No book found'
					});
					return;
				}

				if (!book.reviews) {
					book.reviews = [];
				}
				var indexOfReview = book.reviews.findIndex(function (userReview) {
					return userReview.userId.toString() === user._id.toString();
				});
				if (indexOfReview >= 0) {
					book.reviews[indexOfReview].review = review;
				} else {
					book.reviews.push({
						userId: user._id,
						username: user.username,
						review: review
					});
				}

				if (!book.progresses) {
					book.progresses = [];
				}
				book.progresses.push({
					userId: user._id,
					progress: progress,
					dateOfProgress: new Date()
				});


				book.save(function () {
					var newUpdate = new Update({
						text: user.username + ' updated reading progress of ' + book.title,
						date: new Date(),
						user: {
							username: user.username,
							id: user._id
						},
						book: {
							_id: book.id,
							title: book.title,
						},
						review: review,
						progress: progress
					});

					newUpdate.save(function (err, update) {

						res.json({
							result: book
						});
					});

				});
			});
		});


	return myBooksRouter;
};

module.exports = routes;