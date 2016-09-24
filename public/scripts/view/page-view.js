import { templater } from '../helpers/templater.js';

function loadRawTemplate(selector, templateName) {
    let selectedItem = $(selector);
    return templater.get(templateName)
        .then((template) => {
            selectedItem.html(template());
        });
}

function loadCompiledTemplate(selector, data, templateName) {
    let selectedItem = $(selector);
    return templater.get(templateName)
        .then((template) => {
            console.log(template(data));
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

    booksPage(selector, books) {
        let data = { books}
        return loadCompiledTemplate(selector, data, 'all-books');
    }

}

let pageView = new PageView();
export { pageView };
