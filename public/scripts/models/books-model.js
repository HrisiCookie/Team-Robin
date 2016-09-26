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

    addBook(bookToAdd) {
        let promise = new Promise((resolve, reject) => {
            let url = 'api/books';
            let headers = { 'x-auth-key': localStorage.getItem('STORAGE_AUTHENTICATION_KEY') };
            let options = {
                headers,
                data: bookToAdd
            };

            requester.post(url, options)
                .then((res) => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
        });

        return promise;
    }

    getSingleBookInfo(params) {
        let promise = new Promise((resolve, reject) => {
            let url = `api/books/${params.id}`;

            requester.get(url)
                .then((res)=>{
                    resolve(res);
                }, (err)=>{
                    reject(err);
                });
        });

        return promise;
    }
}

let booksModel = new BooksModel();
export { booksModel };