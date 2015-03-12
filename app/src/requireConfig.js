/*globals require*/
require.config({
    shim: {

    },
    paths: {
        famous: '../lib/famous/src',
        requirejs: '../lib/requirejs/require',
        almond: '../lib/almond/almond',
        hello: '../lib/hello/dist/hello.all.min',
        jquery: '../lib/jquery/dist/jquery',
        bootstrap: '../lib/bootstrap/dist/js/bootstrap'
    },
    packages: [

    ]
});
require(['main']);
