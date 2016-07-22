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

gulp.task('html_copy_to_public', function () {
    return gulp.src(global.getPath('html_copy_to_public'))
        .pipe(plugins.removeDuplicate())
        .pipe(plugins.chmod(777))
        .pipe(gulp.dest('public/client/'));
});