'use strict';

var gulp = require('gulp'),
    global = require('./global.js'),
    bs_angular = require('browser-sync').create('bs_angular');

gulp.task('serve', ['default'], function () {

    bs_angular.init({
        host: "10.0.0.188",
        proxy: "localhost:20466",
        port: 3000,
        notify: true,
        ui: {
            port: 3043
        }
    });

    //#region js
    gulp.watch(global.getPath('js_common'), ['js_common']);
    gulp.watch(global.getPath('js_angular_common'), ['js_angular_common']);
    gulp.watch(global.getPath('js_app'), ['js_app']);
    gulp.watch(global.getPath('html_copy_to_public'), ['html_copy_to_public']);
    gulp
        .watch(['public/assets/js/angular_common.js',
            'public/assets/js/app.js',
            'public/assets/js/common.js',
            'public/client/**/*.js'
        ])
        .on('change', bs_angular.reload);
    //#endregion

    //#region JSON
    gulp.watch(global.getPath('json_minify'), ['json_minify']);
    gulp
        .watch('public/languages/**/*.json')
        .on('change', bs_angular.reload);

    //#endregion

    //#region css
    gulp.watch('public/assets/less/**/*.less', ['less_main']);
    gulp
        .watch('public/assets/css/main.css')
        .on('change', function () {
            bs_angular.reload("public/assets/css/main.css")
        });
    //#endregion

    gulp
        .watch([
            'public/client/**/*.html'
        ])
        .on('change', bs_angular.reload);
});