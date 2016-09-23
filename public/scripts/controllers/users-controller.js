import { templates } from '../templates.js';
import { data } from '../data.js';

let usersController = (function () {

    function login() {
        templates.get('login')
            .then((template) => {
                $('body').html(template()); // find another way to do it

                $('#btn-register').on('click', () => {
                    let user = {
                        username: $('#tb-username').val(),
                        password: $('#tb-password').val()
                    };
                    data.users.register(user)
                        .then(() => {
                            console.log('Registered User');
                        },
                        function(err){
                            console.log(err);
                        });
                });

                $('#btn-login').on('click', ()=>{
                    let user = {
                        username: $('#tb-username').val(),
                        password: $('#tb-password').val()
                    };
                    data.users.login(user)
                        .then(() => {
                            console.log('User loged in');
                        },
                        function(err){
                            console.log(err);
                        });
                });
            });
    }

    return {
        login
    };
})();

export { usersController };