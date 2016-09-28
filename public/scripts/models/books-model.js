import { requester } from '../helpers/requester.js';
import { userModel } from './user-model.js';

const BOOKS_STORAGE = 'STORAGE_ALL_BOOKS';
const VERY_BIG_NUMBER_FOR_BOOKS_COUNT_FOR_OUR_SMALL_PROJECT = 1000000000;

class BooksModel {

    getAll(options) {
        let promise = new Promise((resolve, reject) => {
            options = options || {};
            let page = options.page || 1,
                size = options.size || 10,
                start,
                end;
            if (page === 1) {
                start = 0;
                end = size;
            } else {
                start = (page - 1) * size;
                end = ((page - 1) * size) + size;
            }

            if (localStorage.getItem(BOOKS_STORAGE)) {
                let books = JSON.parse(localStorage.getItem(BOOKS_STORAGE));
                resolve(books.slice(start, end));
                return;
            }

            let url = `api/books?page=1&size=${VERY_BIG_NUMBER_FOR_BOOKS_COUNT_FOR_OUR_SMALL_PROJECT}`;
            requester.get(url)
                .then((res) => {
                    localStorage.setItem(BOOKS_STORAGE, JSON.stringify(res));
                    resolve(res.slice(start, end));
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
                    let books = JSON.parse(localStorage.getItem(BOOKS_STORAGE));
                    books.push(res);
                    localStorage.setItem(BOOKS_STORAGE, JSON.stringify(books));
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
        });

        return promise;
    }

    getSingleBookInfo(bookId) {
        let promise = new Promise((resolve, reject) => {
            if (localStorage.getItem(BOOKS_STORAGE)) {
                let books = JSON.parse(localStorage.getItem(BOOKS_STORAGE));
                let bookToReturn = books.find((book) => {
                    return bookId === book._id;
                });
                resolve(bookToReturn);
                return;
            }

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
            if (localStorage.getItem(BOOKS_STORAGE)) {
                let books = JSON.parse(localStorage.getItem(BOOKS_STORAGE));
                let bookToChange = books.find((book) => {
                    return bookId === book._id;
                });

                bookToChange.rating = rating;

                localStorage.setItem(BOOKS_STORAGE, JSON.stringify(books));
            }
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