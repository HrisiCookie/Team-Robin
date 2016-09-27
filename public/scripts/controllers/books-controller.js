import { userModel } from '../models/user-model.js';
import { booksModel } from '../models/books-model.js';
import { pageView } from '../view/page-view.js';
import { notificator } from '../helpers/notificator.js';

const DEFAULT_BOOK_COVER_URL = 'http://www.jameshmayfield.com/wp-content/uploads/2015/03/defbookcover-min.jpg';

class BooksController {
    all(context, selector) {
        booksModel.getAll(context.params)
            .then((res) => {
                let coveredBooks = res.map((book)=>{
                    let coverAsNumber = parseInt(book.coverUrl);
                    if(!book.coverUrl || !isNaN(coverAsNumber)){
                        book.coverUrl = DEFAULT_BOOK_COVER_URL;
                    }
                    return book;
                });
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
        booksModel.getSingleBookInfo(context.params.id)
            .then((res) => {
                let reviews = res.reviews;
                reviews = reviews.map((review)=>{
                    let nickName;
                    userModel.getNickNameById(review.userId)
                        .then((resNickName)=>{
                            debugger;
                            nickName = resNickName;
                            review.nickName = nickName;
                        });
                });
                console.log(res);
                return pageView.singleBookPage(selector, res);
            })
            .then(() => {
                $('#btn-add-rating').on('click', function () {
                    let tbRating = $(this).prev();
                    let rating = +tbRating.val();
                    if ((typeof rating !== 'number') || rating < 1 || rating > 5) {
                        notificator.error('Invalid Rating');
                    }
                    else {
                        let bookId = $(this).attr('data-id');
                        booksModel.sendRating(bookId, rating)
                            .then((res) => {
                                notificator.success('Rating added successfully');
                                $('#rating').html(rating);
                            }, (err) => {
                                notificator.error(err.responseText);
                            });
                    }

                    tbRating.val('');
                });
            });
    }

    resultGenreBooks(context, selector) {
        let options = { page: 1, size: 10000000};
        booksModel.getAll(options)
            .then((books) => {
                let genrePattern = context.params.genre.toLowerCase();
                let filteredBooks = books.filter((book) => {
                    let genres = book.genres || [];
                    if (genres.some((gen) => { return gen.toLowerCase() === genrePattern; })) {
                        return true;
                    }
                    else {
                        return false;
                    }
                });

                return {
                    filteredBooks,
                    pattern: context.params.genre
                };
            }, (err) => {
                console.log(err);
            })
            .then((res) => {
              return pageView.searchResultPage(selector, res);
            })
            .then();
    }

    storeAllBooksCount() {
        booksModel.getAllBooksCount()
            .then();
    }
}

let booksController = new BooksController();
export { booksController };