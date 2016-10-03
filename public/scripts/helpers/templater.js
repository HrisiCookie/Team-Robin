import * as handlebars from '../../node_modules/handlebars/dist/handlebars.js';

class Templater{
     get(name) {
        let url = `./templates/${name}.handlebars`;
        var promise = new Promise((resolve, reject) => {
            $.get(url, (html) => {
                let template = handlebars.compile(html);
                resolve(template);
            });
        });

        return promise;
    }

}

let templater = new Templater();
export { templater };