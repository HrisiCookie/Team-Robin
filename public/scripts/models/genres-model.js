import { requester } from '../helpers/requester.js';

const GENRES_STORAGE = 'STORAGE_GENRES';

class GenresModel {
    getAll() {
        let promise = new Promise((resolve, reject) => {

            if(localStorage.getItem(GENRES_STORAGE)){
                let genres = JSON.parse(localStorage.getItem(GENRES_STORAGE));
                resolve(genres);
                return;
            }

            let url = 'api/genres';
            requester.get(url)
                .then((res) => {
                    localStorage.setItem(GENRES_STORAGE, JSON.stringify(res));
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