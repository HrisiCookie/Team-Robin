import { booksModel } from '../models/books-model.js';
import { pageView } from '../view/page-view.js';
import { notificator } from '../helpers/notificator.js';

const DEFAULT_BOOK_COVER_URL = 'http://www.jameshmayfield.com/wp-content/uploads/2015/03/defbookcover-min.jpg';

class BooksController {
    all(context, selector) {
        booksModel.getAll(context.params)
            .then((res) => {
                pageView.booksPage(selector, res);
            }, (err) => {
                console.log(err);
            });
    }

    addBook(context, selector) {
        pageView.addBookPage(selector)
            .then(() => {
                $('#btn-add-book').on('click', function () {
                    let title = $('#tb-title').val();
                    let author = $('#tb-author').val();
                    let description = $('#tb-description').val();
                    let pages = $('#tb-pages').val();
                    let coverUrl = $('#tb-cover').val() || DEFAULT_BOOK_COVER_URL;
                    let genres = $('#tb-genres').val()
                        .split(', ');
                    let bookToAdd = {
                        title,
                        author,
                        description,
                        pages,
                        coverUrl,
                        genres
                    };

                    booksModel.addBook(bookToAdd)
                        .then((res) => {
                            notificator.success('Book added successfully');
                            $('#tb-title').val('');
                            $('#tb-author').val('');
                            $('#tb-description').val('');
                            $('#tb-pages').val('');
                            $('#tb-cover').val('');
                            $('#tb-genres').val('');
                        }, (err) => {
                            console.log(err);
                            notificator.error(err.responseText);
                        });
                });
            });
    }

    singleBook(context, selector) {
        booksModel.getSingleBookInfo(context.params)
            .then((res)=>{
                return pageView.singleBookPage(selector, res);
            });
    }
}

let booksController = new BooksController();
export { booksController };