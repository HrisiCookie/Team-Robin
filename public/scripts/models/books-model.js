import { requester } from '../helpers/requester.js';
import { userModel } from './user-model.js';

const STORAGE_BOOKS_COUNT = 'STORAGE_ALL_BOOKS_COUNT';

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
                    let booksCount = +localStorage.getItem(STORAGE_BOOKS_COUNT);
                    booksCount += 1;
                    localStorage.setItem(STORAGE_BOOKS_COUNT, booksCount);
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

    getAllBooksCount() {
        let promise = new Promise((resolve, reject) => {
            let url = `api/books?page=1&size=1000000000`;
            requester.get(url)
                .then((booksCount) => {
                    localStorage.setItem(STORAGE_BOOKS_COUNT, booksCount.length);
                    resolve();
                }, (err) => {
                    reject(err);
                });
        });

        return promise;
    }
}

let booksModel = new BooksModel();
export { booksModel };