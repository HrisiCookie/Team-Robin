require('../polyfills/array');
var bookController = function (Book) {
  var post = function (req, res) {
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
        res.status(201);
        res.send(book);
      });

    });

  };

  var get = function (req, res) {
    var query = {},
      page = req.query.page || 0,
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