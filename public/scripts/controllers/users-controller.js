import { templates } from '../templates.js';
import { data } from '../data.js';

let usersController = (function () {

    function login(context) {
        templates.get('login')
            .then((template) => {
                context.$element().html(template());

                $('#btn-login').on('click', () => {
                    let user = {
                        username: $('#tb-username').val(),
                        password: $('#tb-password').val()
                    };
                    data.users.login(user)
                        .then(() => {
                            console.log('User loged in');
                        },
                        function (err) {
                            console.log(err);
                        });
                });
            });
    }

    function register(context) {
        templates.get('register')
            .then((template) => {
                context.$element().html(template());

                let passMatch = false;

                $('#tb-password-confirm').on('change', function () {
                    let pass = $('#tb-password').val();
                    let passConfirm = $(this).val();
                    if (pass === passConfirm) {
                        passMatch = true;
                    }
                    else {
                        passMatch = false;
                    }
                });

                $('#btn-register').on('click', () => {
                    if (passMatch) {
                        let user = {
                            username: $('#tb-username').val(),
                            password: $('#tb-password').val()
                        };
                        data.users.register(user)
                            .then(() => {
                                console.log('Registered User');
                            },
                            function (err) {
                                console.log(err);
                            });
                    }
                    else {
                        console.log('Passwords dont match');
                    }
                });
            });
    }

    return {
        login,
        register
    };
})();

export { usersController };