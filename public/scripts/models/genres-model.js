import { requester } from '../helpers/requester.js';

class GenresModel {
    getAll() {
        let promise = new Promise((resolve, reject) => {
            let url = 'api/genres';
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

let genresModel = new GenresModel();
export { genresModel };