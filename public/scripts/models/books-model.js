import { requester } from '../helpers/requester.js';

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
}

let booksModel = new BooksModel();
export { booksModel };