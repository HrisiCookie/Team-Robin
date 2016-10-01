import { templater } from '../helpers/templater.js';

function loadRawTemplate(selector, templateName) {
    let selectedItem = $(selector);
    return templater.get(templateName)
        .then((template) => {
            selectedItem.html(template());
        });
}

function setHtmlWithCompiledData(selector, data, templateName) {
    let selectedItem = $(selector);
    return templater.get(templateName)
        .then((template) => {
            selectedItem.html(template(data));
        });
}

class PageView {

    homePage(selector) {
        loadRawTemplate(selector, 'home');
    }

    loginPage(selector) {
        return loadRawTemplate(selector, 'login');
    }

    registerPage(selector) {
        return loadRawTemplate(selector, 'register');
    }

    booksPage(selector, books, pageInfo) {
        let data = {
            books,
            page: pageInfo.page,
            isFirstPage: pageInfo.isFirstPage,
            isLastPage: pageInfo.isLastPage,
            prevPage: pageInfo.prevPage,
            nextPage: pageInfo.nextPage
        };

        return setHtmlWithCompiledData(selector, data, 'books-page');
    }

    profilePage(selector) {
        let data = { username: localStorage.getItem('STORAGE_USERNAME') };
        return setHtmlWithCompiledData(selector, data, 'profile');
    }

    newsfeed(selector, news) {
        let data = { news };
        return setHtmlWithCompiledData(selector, data, 'newsfeed');
    }

    addBookPage(selector) {
        return loadRawTemplate(selector, 'add-book-page');
    }

    singleBookPage(selector, book) {
        return setHtmlWithCompiledData(selector, book, 'single-book');
    }

    genresPage(selector, genres) {
        return setHtmlWithCompiledData(selector, genres, 'genres-page');
    }

    searchResultPage(selector, options) {
        return setHtmlWithCompiledData(selector, options, 'search-result-page');
    }

}

let pageView = new PageView();
export { pageView };
