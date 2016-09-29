var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    cors = require('cors');

// db = mongoose.connect('mongodb://localhost/books');

var db = mongoose.connect('mongodb://team:123456@ds059692.mongolab.com:59692/bookapi');


var Book = require('./models/bookModel');
var User = require('./models/userModel');
var Update = require('./models/updateModel');
var app = express();

var port = process.env.PORT || 3000;


//needed for the client to work
//  serves public dir to localhost
app.use('/', express.static(__dirname + '/public'));
app.use(cors());

app.use(bodyParser.json());


app.use('/', function(req, res, next) {
    var authKey = req.headers['x-auth-key'];
    //console.log(authKey);
    if (!authKey) {
        next();
        return;
    }
    User.find({
            authKey: authKey
        })
        .then(function(users) {
            var user = users[0];
            req.user = user || null;
            next();
        });
});

app.get('/api/book-pages', function(req, res) {
    var size = req.query.size || 10;
    Book.find({}, function(err, books) {
        if (err) {
            res.status(404).send(err);
        }
        var booksCount = books.length;
        var pagesCount = Math.floor(booksCount / size) + 1;
        res.json({
            pages: pagesCount
        });
    });
});

var bookRouter = require('./Routes/bookRoutes')(Book, Update);
var userRouter = require('./Routes/userRoutes')(User);
var myBooksRouter = require('./Routes/myBooksRoutes')(User, Book, Update);
var searchRouter = require('./Routes/searchRoutes')(Book);
var updateRouter = require('./Routes/updateRoutes')(User, Book, Update);

app.use('/api/books', bookRouter);
app.use('/api/authors', bookRouter);
app.use('/api/users', userRouter);
app.use('/api/mybooks', myBooksRouter);
app.use('/api/search', searchRouter);
app.use('/api/updates', updateRouter);

app.get('/api/genres', function(req, res) {
    Book.find({}, function(err, books) {
        var genres = {};
        books.forEach(function(book) {
            if (!book.genres) {
                return;
            }

            book.genres.forEach(function(genre) {
                genres[genre] = true;
            });

        });
        genres = Object.keys(genres);
        res.json(genres);
    });
});

app.listen(port, function() {
    require("openurl").open(`http://localhost:${port}/index.html`);
    console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;
