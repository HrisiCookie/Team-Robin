import * as CryptoJS from '../../bower_components/crypto-js/crypto-js.js';

function createReqData(user) {
    let options = {
        data: {
            username: user.username,
            passHash: CryptoJS.SHA1($(user.password).val()).toString()
        }
    };

    return options;
}

export { createReqData };