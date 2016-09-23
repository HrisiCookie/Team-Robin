let templates = (function () {

    let handlebars = window.handlebars || window.Handlebars;

    function get(name) {
        let url = `./templates/${name}.handlebars`;
        var promise = new Promise((resolve, reject) => {
            $.get(url, (html) => {
                let template = handlebars.compile(html);
                resolve(template);
            });
        });

        return promise;
    }

    return { get };
})();

export { templates };