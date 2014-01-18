module.exports = function(grunt) {


    var wrench = require('wrench'),
        util = require('util');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        docco: {
            debug: {
                src: [
                    'tasks/build.js'
                ],
                options: {
                    layout:'linear',
                    output: 'documentation/'
                }
            }
        },
        'gh-pages': {
            options: {
                base: '.',
                add: true
            },
            src: ['documentation/**']
        },
        'phantomizer-etags': {
            options: {
            },
            "test":{
                "options":{
                    path:""
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-docco');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.registerTask('cleanup-grunt-temp', [],function(){
        wrench.rmdirSyncRecursive(__dirname + '/.grunt', !true);
    });
    grunt.registerTask('default', ['docco','gh-pages', 'cleanup-grunt-temp']);
    grunt.registerTask('etags', ['phantomizer-etags']);

};