import { templates } from '../templates.js';
import { data } from '../data.js';
import { notificator } from '../helpers/notificator.js';

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
                            notificator.success('User loged in');
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
                        notificator.success('Y');                         
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
                            .then((res) => {
                                notificator.success('Registered Successfully');
                                console.log('Registered User');
                                context.redirect('#/login');
                            },
                            function (err) {
                                console.log(err);
                            });
                    }
                    else {
                        notificator.error('Passwords dont match');
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