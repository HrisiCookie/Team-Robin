import { genresModel } from '../models/genres-model.js';
import { pageView } from '../view/page-view.js';

class GenresController {
    all(context, selector){
        genresModel.getAll()
            .then((res) => {
                let data = { genres: res };
                pageView.genresPage(selector, data);
            }, (err) => {
                console.log(err);
            })
            .then(() => {
                $(selector).on('click', '.genre', function(){
                    let $this = $(this);
                    context.redirect(`#/books/?genre=${$this.html()}`);
                });
            });
    }
}

let genresController = new GenresController();
export { genresController };