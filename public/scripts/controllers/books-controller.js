import { userModel } from '../models/user-model.js';
import { booksModel } from '../models/books-model.js';
import { pageView } from '../view/page-view.js';
import { notificator } from '../helpers/notificator.js';

const DEFAULT_BOOK_COVER_URL = 'http://www.jameshmayfield.com/wp-content/uploads/2015/03/defbookcover-min.jpg';
const VERY_BIG_NUMBER_FOR_BOOKS_COUNT_FOR_OUR_SMALL_PROJECT = 1000000000;

function getStatusOfBook(currentUserInfo, book) {
    let booksToRead = currentUserInfo.booksToRead || [];
    let booksRead = currentUserInfo.booksRead || [];
    let booksReading = currentUserInfo.booksCurrentlyReading || [];

    book.isToRead = booksToRead.some((wr) => { return wr._id === book._id; });
    book.isRead = booksRead.some((r) => { return r._id === book._id; });
    book.isReading = booksReading.some((cr) => { return cr._id === book._id; });

    if (book.isToRead || book.isRead || book.isReading) {
        book.status = true;
    }
}

function addNickNamesToReviews(book) {
    let reviews = book.reviews;

    reviews = reviews.map((review) => {
        let nickName;
        userModel.getNickNameById(review.userId)
            .then((resNickName) => {
                nickName = resNickName;
                review.nickName = nickName;
            });
    });

    return book;
}

function convertRatingToArray(book) {
    let rating = book.rating;
    if (rating === 0) {
        book.rating = undefined;
    }
    else {
        book.rating = [];
        for (let i = 0; i < rating; i += 1) {
            book.rating.push(rating);
        }
    }

    return book;
}

function makeStatusReadable(book) {
    let status = book.status;

    switch (status) {
        case 'want-to-read': book.status = 'Want to read';
            break;
        case 'currently-reading': book.status = 'Currently reading';
            break;
        case 'read': book.status = 'Already read';
            break;
    }

    return book;
}

function resultGenreBooks(context, selector, params) {
    booksModel.getBooks(params)
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

            filteredBooks = filteredBooks.map((book) => {
                let coverAsNumber = parseInt(book.coverUrl);
                if (!book.coverUrl || !isNaN(coverAsNumber)) {
                    book.coverUrl = DEFAULT_BOOK_COVER_URL;
                }
                convertRatingToArray(book);
                return book;
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

function resultAuthorBooks(context, selector, params) {
    booksModel.getBooks(params)
        .then((books) => {

            let authorPattern = context.params.author.toLowerCase();
            let filteredBooks = books.filter((book) => {
                if (!book.author) {
                    book.author = 'n/a';
                }
                if (book.author.toLowerCase().indexOf(authorPattern) >= 0) {
                    return true;
                }
                else {
                    return false;
                }
            });

            filteredBooks = filteredBooks.map((book) => {
                let coverAsNumber = parseInt(book.coverUrl);
                if (!book.coverUrl || !isNaN(coverAsNumber)) {
                    book.coverUrl = DEFAULT_BOOK_COVER_URL;
                }
                convertRatingToArray(book);
                return book;
            });

            return {
                filteredBooks,
                pattern: context.params.author
            };
        }, (err) => {
            console.log(err);
        })
        .then((res) => {
            return pageView.searchResultPage(selector, res);
        })
        .then();
}

class BooksController {
    getBooks(context, selector) {
        booksModel.getBooks(context.params)
            .then((books) => {
                let coveredBooks = books.map((book) => {
                    let coverAsNumber = parseInt(book.coverUrl);
                    if (!book.coverUrl || !isNaN(coverAsNumber)) {
                        book.coverUrl = DEFAULT_BOOK_COVER_URL;
                    }
                    convertRatingToArray(book);
                    return book;
                });
                let currPage = +context.params.page;
                let isFirstPage = currPage === 1;
                let isLastPage = books.length < context.params.size;
                let prevPage = isFirstPage ? currPage : currPage - 1;
                let nextPage = isLastPage ? currPage : currPage + 1;
                let pageInfo = {
                    page: currPage,
                    isFirstPage,
                    isLastPage,
                    prevPage,
                    nextPage
                };
                pageView.booksPage(selector, books, pageInfo);
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
        let book, isLoggedIn;
        booksModel.getSingleBookInfo(context.params.id)
            .then((resBook) => {
                addNickNamesToReviews(resBook);
                convertRatingToArray(resBook);

                book = resBook;

                isLoggedIn = $('#page').hasClass('logged-in');
                if (isLoggedIn) {
                    return userModel.getCurrentUserInfo();
                }
            })
            .then((currentUserInfo) => {
                if (isLoggedIn) {
                    getStatusOfBook(currentUserInfo, book);
                }

                return pageView.singleBookPage(selector, book);
            })
            .then(() => {
                $('.rating-adder').on('click', '.btn-add-rating', function () {
                    let rating = $(this).attr('data-id');
                    let bookId = $('#book-title').attr('data-id');
                    booksModel.sendRating(bookId, rating)
                        .then(() => {
                            notificator.success('Rating added');
                            location.reload();
                        });

                });

                $('.status-changer').on('click', '.btn-change-status', function () {
                    let status = $(this).attr('data-status');
                    let bookId = $('#book-title').attr('data-id');

                    booksModel.changeStatus(bookId, status)
                        .then(() => {
                            notificator.success('Status changed');
                            location.reload();
                        });
                });

                $('.review-rating-adder').on('click', '.btn-add-rating', function () {
                    let $this = $(this);
                    let addRatingBtns = $('.review-rating-adder .btn-add-rating').get();
                    addRatingBtns.forEach((btn) => {
                        let $btn = $(btn);
                        if ($btn.hasClass('clicked')) {
                            $btn.removeClass('clicked');
                        }
                    });
                    $this.addClass('clicked');
                    $('.review-rating-adder').attr('data-rating', $this.attr('data-id'));
                });

                $('#btn-review-send').on('click', function () {
                    let bookId = $('#book-title').attr('data-id');
                    let review = $('#tb-review').val();
                    let rating = +$('.review-rating-adder').attr('data-rating');
                    if (typeof rating !== 'number') {
                        notificator.error('Choose rating [1-5]');
                    }
                    else {
                        booksModel.addReview(bookId, review, rating)
                            .then(() => {
                                notificator.success('Review added successfully');
                                location.reload();
                            }, (err) => {
                                notificator.error(err);
                            });
                    }
                });
            });
    }

    resultBooks(context, selector) {
        let params = {
            page: 1,
            size: VERY_BIG_NUMBER_FOR_BOOKS_COUNT_FOR_OUR_SMALL_PROJECT
        };

        if (context.params.author) {
            resultAuthorBooks(context, selector, params);
        }
        else if (context.params.genre) {
            resultGenreBooks(context, selector, params);
        }
    }

    allMyBooks(context, selector) {
        booksModel.getAllMyBooks()
            .then((books) => {
                let coveredBooks = books
                    .map((book) => {
                        let coverAsNumber = parseInt(book.coverUrl);
                        if (!book.coverUrl || !isNaN(coverAsNumber)) {
                            book.coverUrl = DEFAULT_BOOK_COVER_URL;
                        }
                        makeStatusReadable(book);
                        return book;
                    })
                    .sort((a, b) => {
                        return a.status.toLowerCase().localeCompare(b.status.toLowerCase());
                    });
                    
                pageView.allMyBooksPage(selector, coveredBooks);
            });
    }

    storeAllBooksCount() {
        booksModel.getAllBooksCount()
            .then();
    }
}

let booksController = new BooksController();
export { booksController };