import { homeController } from './controllers/home-controller.js';
import { usersController } from './controllers/users-controller.js';

(function () {
    let navigo = new Navigo(null, false);

    navigo.on(homeController.all)
    .on('/login', ()=>{
        usersController.login();
    })
    // .on('#/register', ()=>{

    // })
        .resolve();
})();