import { templater } from '../helpers/templater.js';

function loadRawTemplate(selector, templateName) {
    let selectedItem = $(selector);
    return templater.get(templateName)
        .then((template) => {
            selectedItem.html(template());
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
}

let pageView = new PageView();
export { pageView };
