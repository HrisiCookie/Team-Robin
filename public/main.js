import { homeController } from './scripts/controllers/home-controller.js';
import { usersController } from './scripts/controllers/users-controller.js';

(function () {
    let sammyApp = Sammy('#content', function(){

        this.get('#/', homeController.all);
        this.get('#/login', usersController.login);
        
    });

    $(function(){
        sammyApp.run('#/');
    });
})();