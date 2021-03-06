/// <binding />
/*
*  Admin Admin (AngularJS)
*  Automated tasks ( http://gulpjs.com/ )
*/
'use strict';

var gulp = require('gulp'),
    fs= require('fs'),
    runSequence = require('run-sequence');

// include all tasks from separated files (./tasks)
if (fs.existsSync('./gulp-tasks'))
    require('require-dir')('./gulp-tasks');
require('require-dir')('./bower_components/angular-modular-structure/gulp-tasks');

/* Available tasks

    LESS (t_less.js)
        gulp less_main - compile main stylesheet (main.css/main.min.css)
        gulp less_themes - compile themes (themes/_theme_*.css) and concatenate all themes (themes_combined.min.css)
        gulp less_my_theme - compile my theme
        gulp less_style_switcher - compile style switcher stylesheet (style_switcher.css/style_switcher.min.css)

     JS (t_js.js)
        gulp js_common - common scripts/plugins used in template
        gulp js_angular_common - custom build of angularjs and dependencies
        gulp js_app - concatenate/minify /app files (app.*.js)
        gulp js_app_minify - minify all /app/** /*.js
        gulp js_minify - minify custom/common scripts
        
     JSON (t_json.js)
        gulp json_minify - minify json files (/data directory)

     SERVE (t_serve.js)
        gulp serve - synchronised browser testing - https://www.browsersync.io/docs/

        // to make this task working you need to
        // open t_serve.js and change 'host' and 'proxy' options in bs init()
        // proxy - Proxy an EXISTING vhost (localserver/remote server address)
        // host - Override host detection (your server ip)

 */

// -------------------- PROCESS ALL JS --------------------
gulp.task('js_all', ['clean-scripts', 'js_angular_common', 'js_app', 'js_common', 'js_copy_to_public']);

// -------------------- PROCESS ALL LESS ------------------
gulp.task('less_all', ['less_main', 'less_themes', 'less_my_theme']);

// -------------------- PROCESS ALL HTML ------------------
gulp.task('html_all', ['html_copy_to_public']);

// -------------------- PROCESS ALL JSON ------------------
gulp.task('json_all', ['json_minify']);

// -------------------- DEFAULT TASK ----------------------
gulp.task('default', function (callback) { 
    return runSequence(
        ['js_all', 'html_all', 'json_all'],
        callback
    );
});

