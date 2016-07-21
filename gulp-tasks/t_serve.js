// -------------------- BROWSER SYNC http://www.browsersync.io/docs/ --------------------
'use strict';

var gulp = require('gulp'),
    // browser sync
    bs_angular = require('browser-sync').create('bs_angular');


gulp.task('serve', ['default'], function() {

    bs_angular.init({
        // http://www.browsersync.io/docs/options/#option-host
        host: "10.0.0.188",
        // http://www.browsersync.io/docs/options/#option-proxy
        proxy: "admin_app_rtl.local",
        // http://www.browsersync.io/docs/options/#option-port
        port: 3044,
        // http://www.browsersync.io/docs/options/#option-notify
        notify: true,
        ui: {
            port: 3043
        }
    });

    gulp.watch('public/client/*.js', ['js_app']);
    gulp
        .watch('assets/js/admin_app.min.js')
        .on('change', bs_angular.reload);

    gulp.watch('assets/less/**/*.less', ['less_main']);
    gulp
        .watch('assets/css/main.min.css')
        .on('change', function() {
            bs_angular.reload("assets/css/main.min.css")
        });

    gulp
        .watch([
            'index.html',
            'client/**/*',
            '!client/**/*.min.js'
        ])
        .on('change', bs_angular.reload);

});