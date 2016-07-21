/// <reference path="../bower_components/moment-jalaali-master/build/moment-jalaali.js" />
// -------------------- MINIFY/CONCATENATE JS FILES --------------------
'use strict';

var gulp = require('gulp'),
    plugins = require("gulp-load-plugins")({
        pattern: ['gulp-*', 'gulp.*'],
        replaceString: /\bgulp[\-.]/
    }),
    // chalk error
    chalk = require('chalk'),
    chalk_error = chalk.bold.red;

var getPath = function (taskName) {
    var res = [];
    var cleardPath;
    var isIgnorePath = false;

    var paths = require('./' + taskName + '.json');

    for (var i = 0, path; path = paths[i]; i++) {
        cleardPath = path;
        isIgnorePath = (path[0] == '!') ? true : false;
        if (isIgnorePath)
            cleardPath = cleardPath.substr(1);

        //res.push(((isIgnorePath) ? '!' : '') + 'public/' + cleardPath);
        res.push(path);
//        res.push(((isIgnorePath) ? '!' : '') + 'AMS/' + cleardPath);
    }
    console.log(res)
    return res;
}

// commmon
gulp.task('js_common', function () {
    return gulp.src([
            "bower_components/jquery/dist/jquery.js",
            "bower_components/modernizr/modernizr.js",
            // moment
            "bower_components/moment/moment.js",
            // fastclick (touch devices)
            "bower_components/fastclick/lib/fastclick.js",
            // custom scrollbar
            "bower_components/jquery.scrollbar/jquery.scrollbar.js",
            // create easing functions from cubic-bezier co-ordinates
            "bower_components/jquery-bez/jquery.bez.min.js",
            // Get the actual width/height of invisible DOM elements with jQuery
            "bower_components/jquery.actual/jquery.actual.js",
            // waypoints
            "bower_components/waypoints/lib/jquery.waypoints.js",
            // velocityjs (animation)
            "bower_components/velocity/velocity.js",
            "bower_components/velocity/velocity.ui.js",
            // advanced cross-browser ellipsis
            "bower_components/jquery.dotdotdot/src/js/jquery.dotdotdot.js",
            // hammerjs
            "bower_components/hammerjs/hammer.js",
            // scrollbar width
            "assets/js/custom/jquery.scrollbarWidth.js",
            // jquery.debouncedresize
            "bower_components/jquery.debouncedresize/js/jquery.debouncedresize.js",
            // screenfull
            "bower_components/screenfull/dist/screenfull.js",
            // waves
            "bower_components/Waves/dist/waves.min.js"
    ])
        .pipe(plugins.concat('common.js'))
        .on('error', function (err) {
            console.log(chalk_error(err.message));
            this.emit('end');
        })
        .pipe(gulp.dest('assets/js/'))
        //.pipe(plugins.uglify({
        //    mangle: true
        //}))
        .pipe(plugins.rename('common.min.js'))
        .pipe(plugins.size({
            showFiles: true
        }))
        .pipe(gulp.dest('assets/js/'));
});

// angular common js
gulp.task('js_angular_common', function () {
    return gulp.src([
            "bower_components/angular/angular.js",
            "bower_components/angular-sanitize/angular-sanitize.js",
            "bower_components/angular-ui-router/release/angular-ui-router.js",
            "bower_components/oclazyload/dist/ocLazyLoad.js",
            //TODO what about this file : making decision check and study
            "client/modules/angular-retina.js",
            "bower_components/angular-breadcrumb/dist/angular-breadcrumb.js",
            "bower_components/angular-resource/angular-resource.min.js",
            "bower_components/angular-localization/angular-localization.min.js",
            "bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js",
            "bower_components/angular.apiGateway/dist/angular.apiGateway.js",
            "bower_components/angular-scopeManager/dist/angular-scopeManager.js",
            "bower_components/sutility/dist/sutility.angular.js",
    ])
        .pipe(plugins.concat('angular_common.js'))
        .pipe(gulp.dest('assets/js/'))
        //.pipe(plugins.uglify({
        //    mangle: false
        //}))
        .pipe(plugins.rename('angular_common.min.js'))
        .pipe(plugins.size({
            showFiles: true
        }))
        .pipe(gulp.dest('assets/js/'));
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
        //.pipe(plugins.uglify({
        //    mangle: false
        //}))
        .pipe(plugins.rename({
            extname: ".js"
        }))
        .pipe(gulp.dest('public/'));
});

// app js
gulp.task('js_app', function () {
    return gulp.src(getPath('js_app'))
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