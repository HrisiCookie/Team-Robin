import { booksModel } from '../models/books-model.js';
import { pageView } from '../view/page-view.js';

class BooksController {
    all(context){
        booksModel.getAll(context.params)
            .then((res)=>{
                pageView.booksPage('#content', res);
            }, (err)=>{
                console.log(err);
            });
    }
}

let booksController = new BooksController();
export { booksController };