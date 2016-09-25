import { homeController } from './scripts/controllers/home-controller.js';
import { usersController } from './scripts/controllers/users-controller.js';
import { booksController } from './scripts/controllers/books-controller.js';


(function () {
    let sammyApp = Sammy('#content', function () {

        this.get('#/', function () {
            this.redirect('#/home');
        }); 

        this.get('#/home', (context)=>{
            homeController.all(context, '#content');
        });

        this.get('#/login', (context)=>{
            usersController.login(context, '#content');
        });

        this.get('#/register', (context)=>{
            usersController.register(context, '#content');
        });

        this.get('#/logout', usersController.logout);
        
        this.get('#/books', (context) =>{
            booksController.all(context, '#content');
        });

        this.get('#/profile', (context)=>{
            
            console.log(usersController.profile(context, '#content'));
        });



    });

    $(function () {
        sammyApp.run('#/');
    });
})();