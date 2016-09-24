import { homeController } from './scripts/controllers/home-controller.js';
import { usersController } from './scripts/controllers/users-controller.js';

(function () {
    let sammyApp = Sammy('#content', function () {

        this.get('#/', function () {
            this.redirect('#/home');
        });
        this.get('#/home', homeController.all);
        this.get('#/login', usersController.login);
        this.get('#/register', usersController.register);

    });

    $(function () {
        sammyApp.run('#/');
    });
})();