/// <reference path="../bower_components/moment-jalaali-master/build/moment-jalaali.js" />
// -------------------- MINIFY/CONCATENATE JS FILES --------------------
'use strict';

module.exports = {
    themePath: 'bower_components/angular-modular-structure/',
    getPath : function (taskName) {
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
            res.push(((isIgnorePath) ? '!' : '') + this.themePath + cleardPath);
        }
        console.log(res)
        return res;
    }
}