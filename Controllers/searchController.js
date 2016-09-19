require('../polyfills/array');
var searchController = function (Book) {
	var get = function (req, res) {

		var pattern = req.query.pattern.toLowerCase(),
			page = req.query.page || 1,
			size = req.query.size || 10;
		Book.find({
			"title": {
				"$regex": pattern,
				"$options": "ig"
			}
		}, function (err, books) {
			if (err) {
				throw err;
			} else {
				books.sort(function (b1, b2) {
					var title1 = b1.title.toString(),
						title2 = b2.title.toString();
					return title1.localeCompare(title2);
				});
				var count = books.length;
				books = books.slice((page - 1) * size, page * size);
				books = books.map(function (book) {
					var rating = 0;
					if (book.ratings) {
						var totalRatingsSum = book.ratings.reduce(function (s, userRating) {
							return s + userRating.rating;
						}, 0);
						rating = totalRatingsSum / book.ratings.length;
					}

					return {
						_id: book._id,
						title: book.title,
						rating: rating,
						author: book.author,
						genres: book.genres,
						description: book.description,
						reviews: book.reviews,
						imageURL: book.imageURL,
						coverUrl: book.coverUrl,
						pages: book.pages
					};
				});

				res.json(
					books
				);
			}
		});
	};


	return {
		get: get
	};
};

module.exports = searchController;