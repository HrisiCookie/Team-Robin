(function () {
  'use strict'
  require('../polyfills/array');

  const MIN_RATING = 1;
  const MAX_RATING = 5;

  var bookController = function (Book, Update) {
    var post = function (req, res) {
      var user = req.user;
      var book = new Book(req.body);

      if (!req.body.title) {
        res.status(400);
        res.send('Title is required');
        return;
      }
      Book.findOne({
        title: book.title
      }, function (err, dbbook) {
        if (err) {
          throw err;
        }
        if (dbbook) {
          res.status(400).json({
            message: 'Book already in DB'
          });
          return;
        }
        book.save(function (err, result) {
          if (err) {
            throw err;
          }
          var newUpdate = new Update({
            text: user.username + ' added ' + book.title,
            date: new Date(),
            user: {
              username: user.username,
              id: user._id
            },
            book: {
              _id: book.id,
              title: book.title,
            },
          });

          res.status(201);
          res.send(book);
        });

      });

    };

    var get = function (req, res) {
      var query = {},
        page = req.query.page || 1,
        size = req.query.size || 10;

      var validParams = ['author'];
      validParams.forEach(function (name) {
        if (req.query[name]) {
          query[name] = req.query[name];
        }
      });
      Book.find(query, function (err, books) {
        if (err) {
          res.status(500).send(err);
        } else {
          if (req.query.genre) {
            var genre = req.query.genre.toLowerCase();
            books = books.filter(function (book) {
              return !!(book.genres.find(function (bookGenre) {
                return bookGenre.toLowerCase() === genre;
              }));
            });
          }
          books.sort(function (b1, b2) {
            var title1 = b1.title.toString(),
              title2 = b2.title.toString();
            return title1.localeCompare(title2);
          });
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

          res.json(books);
        }
      });
    };


    return {
      post: post,
      get: get
    };
  };

  module.exports = bookController;
}());