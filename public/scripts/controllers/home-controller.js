import { templates } from '../templates.js';
let homeController = (function () {

    function all(){
       templates.get('home')
        .then((template)=>{
            $('body').html(template()); // must find another way to do it
        });
    }

    return { all };
})();

export { homeController }