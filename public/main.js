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

let $page = $('#page');

(function () {
    let sammyApp = Sammy('#content', function () {

        this.get('#/', function () {
            // this.redirect('#/home');
        });

        this.get('#/home', (context) => {
            $('#search').show();
            $('footer').show();

            homeController.all(context, '#content');
        });

        this.get('#/login', (context) => {
            if ($page.hasClass('logged-in')) {
                context.redirect('#/home');
            }

            $('#search').hide();
            $('footer').hide();
            usersController.login(context, '#content');
        });

        this.get('#/register', (context) => {
            if ($page.hasClass('logged-in')) {
                context.redirect('#/home');
            }

            $('#search').hide();
            $('footer').hide();
            usersController.register(context, '#content');
        });

        this.get('#/logout', usersController.logout);

        this.get('#/books', (context) => {
            $('#search').show();
            $('footer').hide();
            booksController.getBooks(context, '#content');
        });

        this.get('#/profile', (context) => {
            $('#search').hide();
            $('footer').hide();
            usersController.profile(context, '#content');
        });

        this.get('#/genres', (context) => {
            $('#search').show();
            $('footer').hide();
            genresController.all(context, '#content');
        });

        this.get('#/add-book', (context) => {
            if ($('#page').hasClass('logged-in')) {
                $('#search').hide();
                $('footer').hide();
                booksController.addBook(context, '#content');
            } else {
                context.redirect('#/home');
            }
        });

        this.get('#/books-result', (context) => {
            booksController.resultBooks(context, '#content');
        });

        this.get('#/books/:id', (context) => {
            booksController.singleBook(context, '#content');
        });

        this.get('#/mybooks', (context)=>{
            booksController.allMyBooks(context, '#content');
        });
    });

    $(function () {
        sammyApp.run('#/');
    });

    usersController.isUserLoggedIn()
        .then((isLoggedIn) => {
            if (isLoggedIn) {
                $('#page').addClass('logged-in');
            }
            else {
                $('#page').removeClass('logged-in');
            }
        })
        .then(() => {
            return usersController.storeAllUsers();
        })
        .then();
})();