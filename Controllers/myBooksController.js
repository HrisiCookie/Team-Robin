require('../polyfills/array');

var myBooksController = function (User, Book, Update) {
  var put = function (req, res) {
    var user = req.user;

    if (!user) {
      res.status(401);
      res.json({
        message: 'Unauthorized user'
      });
      return;
    }



    var obj = {
      bookId: req.body.bookId,
      bookStatus: req.body.bookStatus
    };
    Book.findById(obj.bookId, function (err, book) {
      if (err) {
        // res.status(500).json(err);
        throw err;
      }
      if (!book) {
        res.status(404).json({
          message: 'No book found'
        });
        return;
      }

      var oldStatus = 'not reading';

      ['booksToRead', 'booksCurrentlyReading', 'booksRead'].forEach(function (name) {
        var index = user[name].findIndex(function (myBook) {
          return myBook._id.toString() === book._id.toString();
        });
        if (index >= 0) {
          user[name].splice(index, 1);
          oldStatus = name;
        }
      });

      var statusMap = {
        'want-to-read': 'booksToRead',
        'currently-reading': 'booksCurrentlyReading',
        'read': 'booksRead'
      };

      var newStatus = statusMap[obj.bookStatus];

      user[statusMap[obj.bookStatus]].push({
        _id: book._id,
        updateDate: new Date(),
        status: newStatus
      });



      User.update({
        _id: user._id
      }, {
        booksToRead: user.booksToRead,
        booksCurrentlyReading: user.booksCurrentlyReading,
        booksRead: user.booksRead
      }, function () {


        /*
        <p>{{text}}</p>
        book: <a href="#/books/{{book.id}}">{{book.title}}</a>
        by <a href="#/users/{{user.id}}">{{user.username}}</a>
        */

        var newUpdate = new Update({
          text: user.username + ' changed ' + book.title + ' \'s status to ' + newStatus,
          date: new Date(),
          user: {
            username: user.username,
            id: user._id
          },
          book: {
            _id: book.id,
            title: book.title,
            status: newStatus
          }
        });

        newUpdate.save(function (err, update) {

          res.json(update);
        });

      });
    });
  };

  var get = function (req, res) {
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
    }, function (err, books) {
      if (err) {
        throw err;
      }
      // 
      // books = books.map(function(book){
      //   if(user.booksToRead.any(function(dbBook){
      //     return dbBook.id === book.id;
      //   })){
      //     book.status = 'want-to-read';
      //   }
      // });
      res.json(books);
    });
  };

  return {
    put: put,
    get: get
  };
};


module.exports = myBooksController;