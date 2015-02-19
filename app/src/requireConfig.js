/*globals require*/
require.config({
    shim: {

    },
    paths: {
        famous: '../lib/famous/src',
        requirejs: '../lib/requirejs/require',
        almond: '../lib/almond/almond',
        hello: '../lib/hello/dist/hello.all.min',
        jquery: '../lib/jquery/dist/jquery'
    },
    packages: [

    ]
});
require(['main']);
