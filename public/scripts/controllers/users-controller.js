import { templater } from '../helpers/templater.js';
import { userModel } from '../models/user-model.js';
import { pageView } from '../view/page-view.js';
import { notificator } from '../helpers/notificator.js';
import { booksModel } from '../models/books-model.js';


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
                            $('#page').addClass('logged-in');
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
                $('#page').removeClass('logged-in');
                context.redirect('#/home');
            });
    }

    profile(context, selector) {
        let currentUserInfo, bookToRead, bookCurrentlyReading, bookRead;
        userModel.getCurrentUserInfo()
            .then((resCurrentUserInfo) => {
                currentUserInfo = resCurrentUserInfo;
                
                if (currentUserInfo.booksRead.length > 0) {
                    return booksModel.getSingleBookInfo(currentUserInfo.booksRead[0]._id);
                }
            })
            .then((resBookRead) => {
                
                bookRead = resBookRead;
                if (currentUserInfo.booksCurrentlyReading.length > 0) {
                    return booksModel.getSingleBookInfo(currentUserInfo.booksCurrentlyReading[0]._id);
                }
            })
            .then((resBookCurrentlyReading) => {
                bookCurrentlyReading = resBookCurrentlyReading;
                if (currentUserInfo.booksToRead.length > 0) {
                    return booksModel.getSingleBookInfo(currentUserInfo.booksToRead[0]._id);
                }
            })
            .then((resBookToRead)=>{
                bookToRead = resBookToRead;
                let data = {
                    currentUserInfo, 
                    bookToRead, 
                    bookCurrentlyReading,
                    bookRead
                };
                
                pageView.profilePage(selector, data);
                return userModel.newsfeed();
            })
            .then((news)=>{
                pageView.newsfeed('#newsfeed', news);
            })
            .then(() => {
                // $('#newsfeed').on('click', '.like', function(){
                //     let newsId = $(this).parents('.new-wrapper')
                //         .attr('data-id');
                //     userModel.like(newsId)
                //         .then((res)=>{
                //             console.log(res);
                //         }, (err)=>{
                //             console.log(err);
                //         });
                // });   
                // Cause Server Error update.likes.push is nof a function

                // $('#newsfeed').on('click', '.btn-add-comment', function () {
                //     let $this = $(this);
                //     let comment = $this
                //         .prev()
                //         .val();

                //     let newsId = $this
                //         .parents('.new-wrapper')
                //         .attr('data-id');

                //     userModel.comment(comment, newsId)
                //         .then((res)=>{
                //             console.log(res);
                //         }, (err)=>{
                //             console.log(err);
                //         });
                // });
                //Works only with old updates
            });
    }

    isUserLoggedIn() {
        return userModel.isLoggedIn();
    }

    storeAllUsers() {
        return userModel.getAllUsernames();
    }

}

let usersController = new UserController();
export { usersController };