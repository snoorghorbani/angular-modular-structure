// -------------------- MINIFY JSON --------------------
'use strict';

var gulp = require('gulp'),
    bower = require('gulp-bower'),
    global = require('./global.js'),
    plugins = require("gulp-load-plugins")({
        pattern: ['gulp-*', 'gulp.*'],
        replaceString: /\bgulp[\-.]/
    }),
    // chalk error
    chalk = require('chalk'),
    chalk_error = chalk.bold.red,
    title = chalk.bgWhite.green;

gulp.task('install_bower_packages', function () {
    return bower({
      interactive:true,
      verbosity:2
    });
});
