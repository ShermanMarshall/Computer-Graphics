requirejs.config({
    paths : {
        jquery : 'vendor/jquery',
        jqueryui : 'vendor/jqueryui',
        jquerylayout : 'vendor/jquerylayout',
        jquerymigrate : 'vendor/jquerymigrate',
        underscore : 'vendor/underscore',
        backbone : 'vendor/backbone',
        handlebars : 'vendor/handlebars',
        marionette : 'vendor/marionette',
        wreqr: 'vendor/wreqr',
        babysitter: 'vendor/babysitter',
        highcharts: 'vendor/highcharts',
        text : 'vendor/text',
        chosen: 'vendor/chosen',
	three: 'vendor/three.js'
    },
    shim : {
        'jqueryui' : { deps: ['jquery'], exports: 'jqueryui' },
        'jquerymigrate': { deps: ['jquery'], exports: 'jquery'},
        'jquerylayout': { deps: ['jquery', 'jqueryui', 'jquerymigrate'], exports: 'jquerylayout' },
        'marionette': { deps : ['jquery', 'underscore', 'backbone'], exports: 'marionette' },
        'highcharts': { deps: ['jquery'], exports: 'highcharts'}
    }
});

require(['js/main']);
