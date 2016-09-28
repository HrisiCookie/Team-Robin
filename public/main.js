import {
    homeController
} from './scripts/controllers/home-controller.js';
import {
    usersController
} from './scripts/controllers/users-controller.js';
import {
    booksController
} from './scripts/controllers/books-controller.js';
import {
    genresController
} from './scripts/controllers/genres-controller.js';


(function () {
    let sammyApp = Sammy('#content', function () {

        this.get('#/', function () {
            this.redirect('#/home');
        });

        this.get('#/home', (context) => {
            $('#search').show();
            $('.logged-in').css({ 'visibility': 'visible' });
            homeController.all(context, '#content');
        });

        this.get('#/login', (context) => {
            $('#search').hide();
            usersController.login(context, '#content');
        });

        this.get('#/register', (context) => {
            $('#search').hide();
            usersController.register(context, '#content');
        });

        this.get('#/logout', usersController.logout);

        this.get('#/books', (context) => {
            $('#search').show();
            booksController.getBooks(context, '#content');
        });

        this.get('#/profile', (context) => {
            $('#search').hide();
            usersController.profile(context, '#content');
        });

        this.get('#/genres', (context) => {
            $('#search').show();
            genresController.all(context, '#content');
        });

        this.get('#/add-book', (context) => {
            usersController.isUserLoggedIn()
                .then((isLogged) => {
                    if (!isLogged) {
                        context.redirect('#/home');
                    } else {
                        $('#search').hide();
                        booksController.addBook(context, '#content');
                    }
                });

        });

        this.get('#/books-result', (context) => {
            booksController.resultGenreBooks(context, '#content');
        });

        this.get('#/books/:id', (context) => {
            booksController.singleBook(context, '#content');
        });
    });

    $(function () {
        sammyApp.run('#/');
    });

    usersController.isUserLoggedIn()
        .then((isLogged) => {
            if (isLogged) {
                $('body').addClass('logged');
                $('#login').addClass('hidden');
                $('#register').addClass('hidden');
                $('#logout').removeClass('hidden');
                $('#add-book').removeClass('hidden');
                $('#my-profile').removeClass('hidden');
            } else {
                $('body').removeClass('logged');
                $('#login').removeClass('hidden');
                $('#register').removeClass('hidden');
                $('#logout').addClass('hidden');
                $('#add-book').addClass('hidden');
                $('#my-profile').addClass('hidden');
            }
        })
        .then(() => {
            usersController.storeAllUsers();
        });
})();