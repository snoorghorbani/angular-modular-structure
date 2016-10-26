'use strict';

var gulp = require('gulp'),
    global = require('./global.js'),
    _ = require('sutility'),
    bs_angular = require('browser-sync').create('bs_angular');

gulp.task('reload', function () {
    bs_angular.reload();
})

gulp.task('serve', ['default'], function () {

    //bs_angular.init(_.update({
    //    host: "10.0.0.188",
    //    proxy: "localhost:20466",
    //    port: 3000,
    //    notify: true,
    //    ui: {
    //        port: 3043
    //    }
    //}, global.get_gen_conf("t_serve") || {}));
    bs_angular.init({
        port: 54231 + 1
        //server: {
        //    baseDir: "./",
        //}
    });

    //#region js

    gulp.watch(global.getPath('js_common'), ['js_common' , 'reload']);
    gulp.watch(global.getPath('js_angular_common'), ['js_angular_common', 'reload']);
    gulp.watch(global.getPath('js_app'), ['js_app', 'reload']);
    gulp.watch(global.getPath('js_copy_to_public'), ['js_copy_to_public', 'reload']);
    //gulp
    //    .watch(['public/assets/js/angular_common.js',
    //            'public/assets/js/app.js',
    //            'public/assets/js/common.js'
    //    ])
    //    .on('change', bs_angular.reload);

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

    //#region html

    gulp.watch('client/**/*.html', ['html_copy_to_public', 'reload']);

    //#endregion
});