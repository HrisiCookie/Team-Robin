import { pageView } from '../view/page-view.js';

class HomeController {

    all(context, selector) {
        return pageView.homePage(selector);
    }
}

let homeController = new HomeController();
export { homeController };