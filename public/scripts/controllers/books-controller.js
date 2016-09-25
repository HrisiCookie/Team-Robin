import { booksModel } from '../models/books-model.js';
import { pageView } from '../view/page-view.js';

class BooksController {
    all(context, selector){
        booksModel.getAll(context.params)
            .then((res)=>{
                pageView.booksPage(selector, res);
            }, (err)=>{
                console.log(err);
            });
    }
}

let booksController = new BooksController();
export { booksController };