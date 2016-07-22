/// <reference path="../bower_components/moment-jalaali-master/build/moment-jalaali.js" />
// -------------------- MINIFY/CONCATENATE JS FILES --------------------
'use strict';

var gulp = require('gulp'),
    global = require('./global.js'),
    plugins = require("gulp-load-plugins")({
        pattern: ['gulp-*', 'gulp.*'],
        replaceString: /\bgulp[\-.]/
    }),
    // chalk error
    chalk = require('chalk'),
    chalk_error = chalk.bold.red;

// commmon
gulp.task('js_common', function () {
    return gulp.src(global.getPath('js_common'))
        .pipe(plugins.concat('common.js'))
        .on('error', function (err) {
            console.log(chalk_error(err.message));
            this.emit('end');
        })
        .pipe(gulp.dest('public/assets/js/'))
        //.pipe(plugins.uglify({
        //    mangle: true
        //}))
        .pipe(plugins.rename('common.min.js'))
        .pipe(plugins.size({
            showFiles: true
        }))
        .pipe(gulp.dest('public/assets/js/'));
});

// angular common js
gulp.task('js_angular_common', function () {
    return gulp.src(global.getPath('js_angular_common'))
        .pipe(plugins.concat('angular_common.js'))
        .pipe(gulp.dest('public/assets/js/'))
        //.pipe(plugins.uglify({
        //    mangle: false
        //}))
        .pipe(plugins.rename('angular_common.min.js'))
        .pipe(plugins.size({
            showFiles: true
        }))
        .pipe(gulp.dest('public/assets/js/'));
});

// angular app minify
gulp.task('js_app_minify', function () {
    return gulp.src([
            "client/*.js",
            "client/**/*.js",

            "!**/*.module.js",
            "!**/*.provider.js",
            "!**/*.module_config.js",
            "!**/*.state.js",
            "!**/*.menu.js",
            "!**/*.api.js",

            "!client/core/factories/*.js",
            "!client/core/modules/*.js",
            "!client/core/services/*.js",
            "!client/core/directives/*.js",
            "!client/core/filters/*.js",
            "!client/core/controllers/*.js",

            "!client/main_sidebar/main_sidebar_menu.service.js",
            "!client/main_sidebar/main_sidebar.controller.js",
            "!client/header/main_header.controller.js",

            "!client/app.oc_lazy_load.js",

            "!client/**/*.min.js",
            "!client/*.min.js"
    ], { base: './' })
        .pipe(plugins.chmod(777))
        .pipe(plugins.uglify({
            mangle: false
        }))
        .pipe(plugins.rename({
            extname: ".min.js"
        }))
        .pipe(gulp.dest('public/'));
});

gulp.task('js_copy_to_public', function () {
    return gulp.src(global.getPath('js_copy_to_public'))
        .pipe(plugins.removeDuplicate())
        .pipe(plugins.chmod(777))
        //.pipe(plugins.uglify({
        //    mangle: false
        //}))
        .pipe(plugins.rename({
            extname: ".js"
        }))
        .pipe(gulp.dest('public/client/'));
});

// app js
gulp.task('js_app', function () {
    return gulp.src(global.getPath('js_app'))
        .pipe(plugins.removeDuplicate())
        .pipe(plugins.concat('app.js'))
        .pipe(gulp.dest('public/assets/js/'))
        //.pipe(plugins.uglify({
        //    mangle: false
        //}))
        .pipe(plugins.rename('app.min.js'))
        .pipe(plugins.size({
            showFiles: true
        }))
        .pipe(gulp.dest('public/assets/js/'));
});

// common/custom functions
gulp.task('js_minify', function () {
    return gulp.src([
            'assets/js/custom/*.js',
            '!assets/js/**/*.min.js'
    ])
        .pipe(plugins.uglify({
            mangle: true
        }))
        .pipe(plugins.rename({
            extname: ".min.js"
        }))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
});