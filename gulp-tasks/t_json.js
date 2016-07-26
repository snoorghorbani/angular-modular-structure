// -------------------- MINIFY JSON --------------------
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


gulp.task('json_minify', function () {
    return gulp.src(global.getPath("json_minify"))
        .pipe(plugins.jsonminify())
        .on('error', function (err) {
            console.log(chalk_error(err.message));
            this.emit('end');
        })
        .pipe(plugins.rename({
            extname: ".json"
        }))
        .pipe(gulp.dest('public/languages'));
});