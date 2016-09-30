import 'app/polyfills/array';
import 'bower_components/sha1/index';
import toastr from 'toastr';
//users

var DEFAULT_COVER_URL = 'http://cdn.instructables.com/F1K/H87Q/GZUAFXDP/F1KH87QGZUAFXDP.MEDIUM.jpg';

function registerUser(user) {
  var promise = new Promise(function (resolve, reject) {
    var url = 'api/users';
    var pass = user.password;
    var passHash = CryptoJS.SHA1(pass).toString();

    var userSend = {
      username: user.username,
      passHash: passHash
    };

    $.ajax({
      url: url,
      method: 'POST',
      data: JSON.stringify(userSend),
      contentType: 'application/json',
      success: function (user) {
        resolve(user);
      },
      error: function (err) {
        resolve(err);
      }
    });
  });
  return promise;
}

function loginUser(user) {
  var promise = new Promise(function (resolve, reject) {
    var url = 'api/users/auth';
    var pass = user.password;
    var passHash = CryptoJS.SHA1(pass).toString();
    var userSend = {
      username: user.username,
      passHash: passHash
    };

    var authKey = localStorage.getItem('auth-key'),
      username = localStorage.getItem('username');

    $.ajax({
      url: url,
      method: 'PUT',
      data: JSON.stringify(userSend),
      contentType: 'application/json',
      success: function (user) {
        username = user.username;
        authKey = user.authKey;
        localStorage.setItem('username', username);
        localStorage.setItem('auth-key', authKey);
        console.log('in success');
        resolve(user);
      },
      error: function (err) {
        console.log('in error');
        reject(err);

      }
    });
  });
  return promise;
}

function logoutUser() {
  var promise = new Promise(function (resolve, reject) {
    localStorage.removeItem('username');
    localStorage.removeItem('auth-key');
    resolve();
  });
  return promise;
}

function hasUser() {
  return !!localStorage.getItem('auth-key');
}

function getUser(user) {
  var options = options || {},
    promise = new Promise(function (resolve, reject) {
      var url = '/api/users',
        queryParams = [],
        isFirst = true;
      for (var key in options) {
        if (typeof options[key] === 'undefined') {
          continue;
        }

        var concatSymbol = '&';
        if (isFirst) {
          concatSymbol = '?';
          isFirst = false;
        }
        url += `${concatSymbol}${key}=${options[key]}`;
      }

      $.ajax({
        url: url,
        contentType: 'application/json',
        success: function (users) {
          resolve(users);
        },
        error: function (err) {
          reject(err);
        }
      });
    });
  return promise;
}

function getUserById(id) {
  var promise = new Promise(function (resolve, reject) {
    var url = 'api/users/' + id;

    $.ajax({
      url: url,
      contentType: 'application/json',
      success: function (user) {
        resolve(user);
      },
      error: function (err) {
        reject(err);
      }
    });
  });
  return promise;
}

function editUser(user) {
  var promise = new Promise(function (resolve, reject) {
    var url = '/api/users/' + user.id;

    $.ajax({
      url: url,
      method: 'PUT',
      data: JSON.stringify(user),
      contentType: 'application/json',
      success: function (user) {
        resolve(user);
      }
    });
  });
  return promise;
}

//user validation
function validateInput(tagId, errorMsg) {
  if (tagId.val() === '' || tagId.val().trim() === '') {
    toastr.error(errorMsg);
    return false;
  } else {
    return true;
  }
}

//books
function saveBook(book) {
  var promise = new Promise(function (resolve, reject) {
    var url = 'api/books';

    $.ajax({
      url: url,
      method: 'POST',
      data: JSON.stringify(book),
      contentType: 'application/json',
      success: function (book) {
        resolve(book);
      },
      error: function (err) {
        reject(err);
      }
    });
  });
  return promise;
}

//getBooks({genre: 'sci-fi', author: "...."})
function getBooks(options) {
  options = options || {};
  options.page = options.page || 1;
  options.size = options.size || 10;

  var promise = new Promise(function (resolve, reject) {
    var url = '/api/books',
      queryParams = [],
      isFirst = true;
    for (var key in options) {
      if (typeof options[key] === 'undefined') {
        continue;
      }

      var concatSymbol = '&';
      if (isFirst) {
        concatSymbol = '?';
        isFirst = false;
      }
      url += `${concatSymbol}${key}=${options[key]}`;
    }

    $.ajax({
      url: url,
      contentType: 'application/json',
      success: function (books) {
        books = books.map(function (book) {
          if (!book.coverUrl) {
            book.coverUrl = DEFAULT_COVER_URL;
          }
          return book;
        });
        resolve(books);
      },
      error: function (err) {
        reject(err);
      }
    });
  });
  return promise;
}

function getBookById(id) {
  var promise = new Promise(function (resolve, reject) {
    var url = '/api/books/' + id;

    $.ajax({
      url: url,
      method: 'GET',
      contentType: 'application/json',
      success: function (book) {
        if (!book.coverUrl) {
          book.coverUrl = DEFAULT_COVER_URL;
        }
        resolve(book);
      }
    });
  });
  return promise;
}

function getGenres() {
  var promise = new Promise(function (resolve, reject) {
    var url = '/api/genres';

    $.ajax({
      url: url,
      method: 'GET',
      contentType: 'application/json',
      success: function (genres) {
        resolve(genres);
      }
    });
  });
  return promise;
}

function editBook(book) {
  var promise = new Promise(function (resolve, reject) {

    var url = '/api/books/' + book.id;

    $.ajax({
      url: url,
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(book),
      success: function (resBook) {
        resolve(resBook);
      }
    });
  });

  return promise;
}

function changeMyBookStatus(bookId, bookStatus) {
  var data = {
    bookId, bookStatus
  };
  var promise = new Promise(function (resolve, reject) {
    $.ajax({
      url: '/api/mybooks',
      method: 'PUT',
      data: JSON.stringify(data),
      contentType: 'application/json',
      headers: {
        'x-auth-key': localStorage.getItem('auth-key')
      },
      success: function (res) {
        resolve(res);
      },
      error: function (err) {
        reject(err);
      }
    });
  });
  return promise;
}

function getMyBooks() {
  var promise = new Promise(function (resolve, reject) {
    $.ajax({
      url: '/api/mybooks/all?noCaching=' + Math.random(),
      method: 'GET',
      contentType: 'application/json',
      headers: {
        'x-auth-key': localStorage.getItem('auth-key')
      },
      success: function (books) {
        books = books.map(function (book) {
          if (!book.coverUrl) {
            book.coverUrl = DEFAULT_COVER_URL;
          }
          return book;
        });
        resolve(books);
      },
      error: function (err) {
        reject(err);
      }
    });
  });
  return promise;
}

var books = {
  get: getBooks,
  save: saveBook,
  getById: getBookById,
  edit: editBook
};

var users = {
  get: getUser,
  register: registerUser,
  login: loginUser,
  logout: logoutUser,
  hasUser: hasUser,
  getById: getUserById,
  edit: editUser
};

var myBooks = {
  changeStatus: changeMyBookStatus,
  get: getMyBooks
};

var genres = {
  get: getGenres
};

var validation = {
  validateInput: validateInput
};

export {
  books,
  genres,
  users,
  myBooks,
  validation
};

export default {
  books,
  genres,
  users,
  myBooks,
  validation
};