System.config({
    transpiler: 'babel',
    map: {
        babel: '../node_modules/babel-core/browser.js'
    }
});

System.import('tests.js')
    .then(function () {
        mocha.run();
    }, function (err) {
        console.log(err.message);
    });