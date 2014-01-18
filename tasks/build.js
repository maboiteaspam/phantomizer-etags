'use strict';

module.exports = function(grunt) {

    var wrench = require('wrench'),
        util = require('util');
    //-
    var path        = require("path");
    var fs          = require("fs");


    grunt.registerMultiTask("phantomizer-etags", "Asset's Etags generator for phantomizer app", function(){

        var options = this.options({
            routing:{},
            target_path:"export/",
            file_name:"sitemap.xml",
            base_url:"http://localhost/"
        });
        // Recursively read directories contents
        var files = [];
        wrench.readdirRecursive('my_directory_name', function(error, curFiles) {
            // curFiles is what you want
        });

        grunt.log.ok();
    });


};