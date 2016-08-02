/// <reference path="../bower_components/moment-jalaali-master/build/moment-jalaali.js" />
// -------------------- MINIFY/CONCATENATE JS FILES --------------------
'use strict';
var fs = require('fs');
var themeBowerManifest = require('../bower.json');
var generatorConfig = fs.readFileSync('./.yo-rc.json');
generatorConfig = JSON.parse(generatorConfig);
var bowerConfig = fs.readFileSync('./.bowerrc');
bowerConfig = JSON.parse(bowerConfig)


var get_gen_conf = function (name) {
    return generatorConfig["generator-ams"][name];
}
var get_theme_bower_path = function () {
    return [bowerConfig.directory, themeBowerManifest.name,''].join('/');
}

module.exports = {
    get_gen_conf: get_gen_conf,
    bowerDir: get_gen_conf(),
    themePath: get_theme_bower_path(),
    getPath: function (taskName) {
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

        return res;
    },
}