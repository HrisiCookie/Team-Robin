var Requester = (function () {

    function send(method, url, options) {
        options = options || {};

        let headers = options.headers || {},
            data = options.data || undefined;

        let promise = new Promise((resolve, reject) => {
            $.ajax(url, {
                method,
                contentType: 'application/json',
                data: JSON.stringify(data),
                headers,
                success: function (response) {
                    resolve(response);
                },
                error: function (err) {
                    reject(err);
                }

            })
        });

        return promise;
    }

    function get(url, options) {
        return send('GET', url, options);
    }

    function post(url, options) {
        return send('POST', url, options);
    }

    function put(url, options) {
        return send('PUT', url, options);
    }

    function del(url, options) {
        return send('POST', url, options);
    }

    return {
        send,
        get,
        post,
        put,
        delete: del
    };
} ());

export { Requester };