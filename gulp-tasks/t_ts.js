///// <reference path="../bower_components/moment-jalaali-master/build/moment-jalaali.js" />
//// -------------------- MINIFY/CONCATENATE JS FILES --------------------
//'use strict';

//var gulp = require('gulp'),
//    global = require('./global.js'),
//    plugins = require("gulp-load-plugins")({
//        pattern: ['gulp-*', 'gulp.*'],
//        replaceString: /\bgulp[\-.]/
//    }),
//    // chalk error
//    chalk = require('chalk'),
//    chalk_error = chalk.bold.red,
//    ts = require('gulp-typescript');

//// commmon
//gulp.task('js_common', function () {
//    return gulp.src(global.getPath('js_common'))
//        .pipe(plugins.concat('common.js'))
//        .on('error', function (err) {
//            console.log(chalk_error(err.message));
//            this.emit('end');
//        })
//        .pipe(plugins.chmod(777))
//        .pipe(gulp.dest('public/assets/js/'))
//        //.pipe(plugins.uglify({
//        //    mangle: true
//        //}))
//        .pipe(plugins.rename('common.min.js'))
//        .pipe(plugins.size({
//            showFiles: true
//        }))
//        .pipe(plugins.chmod(777))
//        .pipe(gulp.dest('public/assets/js/'));
//});



//gulp.task('ts', function () {
//    return gulp.src('ts/**/*.ts')
//        .pipe(ts())
//        .pipe(gulp.dest());
//});