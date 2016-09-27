import { requester } from '../helpers/requester.js';
import * as CryptoJS from '../../bower_components/crypto-js/crypto-js.js';

const STORAGE_AUTH_KEY = 'STORAGE_AUTHENTICATION_KEY';
const STORAGE_USERNAME = 'STORAGE_USERNAME';

function createRequestOptions(user) {
    let options = {
        data: {
            username: user.username,
            passHash: CryptoJS.SHA1($(user.password).val()).toString()
        }
    };

    return options;
}

class UserModel {
    register(user) {
        let promise = new Promise((resolve, reject) => {
            let url = 'api/users';
            let options = createRequestOptions(user);

            requester.post(url, options)
                .then(function (res) {
                    resolve(res);
                }, function (err) {
                    reject(err.responseText);
                });
        });

        return promise;
    }

    login(user) {
        let promise = new Promise((resolve, reject) => {
            let url = 'api/users/auth';
            let options = createRequestOptions(user);

            requester.put(url, options)
                .then(function (res) {
                    localStorage.setItem(STORAGE_AUTH_KEY, res.authKey);
                    localStorage.setItem(STORAGE_USERNAME, res.username);
                    resolve(res);
                }, function (err) {
                    reject(err);
                });
        });

        return promise;
    }

    isLoggedIn() {
        return Promise.resolve()
            .then(() => {
                return !!localStorage.getItem(STORAGE_AUTH_KEY);
            });
    }

    getLoggedHeader() {
        return Promise.resolve()
            .then(() => {
                return {
                    'x-auth-key': localStorage.getItem(STORAGE_AUTH_KEY)
                };
            });
    }


    logout() {
        let promise = new Promise((resolve, reject) => {
            localStorage.removeItem(STORAGE_AUTH_KEY);
            localStorage.removeItem(STORAGE_USERNAME);
            resolve();
        });

        return promise;
    }

    newsfeed() {
        let promise = new Promise((resolve, reject) => {
            let url = 'api/updates';
            requester.get(url)
                .then((res) => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
        });

        return promise;
    }

    like(newsId) {
        let promise = new Promise((resolve, reject) => {
            let url = `api/updates/${newsId}`;
            let headers = { 'x-auth-key': localStorage.getItem(STORAGE_AUTH_KEY) };
            let options = { headers };
            requester.put(url, options)
                .then((res) => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
        });

        return promise;
    }

    comment(comment, newsId) {
        let promise = new Promise((resolve, reject) => {
            let url = `api/updates/${newsId}/comment`;
            let headers = { 'x-auth-key': localStorage.getItem(STORAGE_AUTH_KEY) };
            let options = {
                headers,
                data: {
                    comment
                }
            };

            requester.put(url, options)
                .then((res) => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
        });

        return promise;
    }

    getAllUsernames() {
        let promise = new Promise((resolve, reject) => {
            let url = 'api/users';
            requester.get(url)
                .then((res) => {
                    res.forEach((user) => {
                        localStorage.setItem(user._id, user.nickname);
                    });
                });
        });

        return promise;
    }

    getNickNameById(userId){
        return Promise.resolve()
            .then(()=>{
                return localStorage.getItem(userId);
            });
    }
}

let userModel = new UserModel();
export { userModel };