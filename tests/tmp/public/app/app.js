import toastr from 'toastr';

import data from 'app/data/data';
import handlebars from 'bower_components/handlebars/handlebars';

import homeController from 'app/controllers/homeController';
import booksController from 'app/controllers/booksController';
import usersController from 'app/controllers/usersController';
import genresController from 'app/controllers/genresController';
import mybooksController from 'app/controllers/mybooksController';

var sammyApp = Sammy('#content', function () {

  this.get('#/', homeController.all);

  this.get('#/books', booksController.all);
  this.get('#/books/add', booksController.add);
  this.get('#/books/:id', booksController.byId);
  this.get('#/books/:id/edit', booksController.edit);

  this.get('#/login', usersController.login);
  this.get('#/register', usersController.register);

  this.get('#/genres', genresController.all);

  this.get('#/mybooks', mybooksController.all);
});

$(function () {
  sammyApp.run('#/books');

  if (data.users.hasUser()) {
    $('#btn-nav-logout')
      .removeClass('hidden');

  } else {
    $('#btn-nav-login')
      .removeClass('hidden');

  }

  $('#btn-nav-logout').on('click', function () {
    data.users.logout()
      .then(function () {
        document.location.reload(true);
      });
  });

  loadGenresSidebar();
});

function loadGenresSidebar() {
  data.genres.get()
    .then(function (genres) {
      var $container = $('<div />');
      $.get('app/partials/genres-sidebar-partial.html', function (templateString) {
        var template = handlebars.compile(templateString);

        var html = template({
          genres
        });
        $('#genres-container').html(html);
      });
    });
}
