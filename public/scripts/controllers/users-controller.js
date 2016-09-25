import { templater } from '../helpers/templater.js';
import { userModel } from '../models/user-model.js';
import { pageView } from '../view/page-view.js';
import { notificator } from '../helpers/notificator.js';


class UserController {

    login(context, selector) {
        pageView.loginPage(selector)
            .then(() => {
                $('#btn-login').on('click', () => {
                    let user = {
                        username: $('#tb-username').val(),
                        password: $('#tb-password').val()
                    };
                    userModel.login(user)
                        .then((res) => {
                            notificator.success(`${res.username} signed in!`);
                            context.redirect('#/profile');
                        },
                        function (err) {
                            notificator.error('Invalid username or password');
                        });
                });
            });
    }

    register(context, selector) {
        pageView.registerPage(selector)
            .then(() => {
                $('#btn-register').on('click', () => {
                    let pass = $('#tb-password').val();
                    let passConfirm = $('#tb-password-confirm').val();
                    if (pass === passConfirm) {
                        let user = {
                            username: $('#tb-username').val(),
                            password: $('#tb-password').val()
                        };
                        userModel.register(user)
                            .then((res) => {
                                notificator.success('Registered Successfully');
                                context.redirect('#/login');
                            }, (err) => {
                                notificator.error(JSON.parse(err).err);
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

    logout(context) {
        userModel.logout()
            .then(() => {
                notificator.success('User signed out');
                context.redirect('#/home');
            });
    }

    profile(context, selector) {
        pageView.profilePage(selector)
            .then(userModel.newsfeed)
            .then((res) => {
                pageView.newsfeed('#newsfeed', res);
            })
            .then(() => {
                $('#newsfeed').on('click', '.like', function(){
                    let id = $(this).parents('.new-wrapper')
                        .find('.new-text')
                        .attr('data-id');
                    userModel.like(id)
                        .then((res)=>{
                            console.log(res);
                        }, (err)=>{
                            console.log(err);
                        });
                });
            });
    }


}

let usersController = new UserController();
export { usersController };