import { requester } from '../helpers/requester.js';
import { userModel } from './user-model.js';

class BooksModel {

    getAll(options) {
        let promise = new Promise((resolve, reject) => {
            let page = options.page || 1;
            let size = options.size || 10;
            let url = `api/books?page=${page}&size=${size}`;

            requester.get(url)
                .then((res) => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
        });

        return promise;
    }

    addBook(bookToAdd) {
        let promise = new Promise((resolve, reject) => {
            let url = 'api/books';
            let headers;
            userModel.getLoggedHeader()
                .then((resHeader) => {
                    headers = resHeader;
                })
                .then(() => {
                    let options = {
                        headers,
                        data: bookToAdd
                    };

                    return requester.post(url, options);
                })
                .then((res) => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
        });

        return promise;
    }

    getSingleBookInfo(bookId) {
        let promise = new Promise((resolve, reject) => {
            let url = `api/books/${bookId}`;

            requester.get(url)
                .then((res) => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
        });

        return promise;
    }

    sendRating(bookId, rating) {
        let promise = new Promise((resolve, reject) => {
            let url = `api/books/${bookId}`;
            let headers;
            userModel.getLoggedHeader()
                .then((resHeader) => {
                    headers = resHeader;
                })
                .then(() => {
                    let options = {
                        headers,
                        data: {
                            bookId,
                            rating
                        }
                    };

                    return requester.put(url, options);
                })
                .then((res) => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
        });

        return promise;
    }
}

let booksModel = new BooksModel();
export { booksModel };