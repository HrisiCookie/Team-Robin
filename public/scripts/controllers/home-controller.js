import { templates } from '../templates.js';
let homeController = (function () {

    function all(context){
       templates.get('home')
        .then((template)=>{
            context.$element().html(template()); 
        });
    }

    return { all };
})();

export { homeController }