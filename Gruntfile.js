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
    release: {
      options: {
        npm: false, //default: true
        // true will apply the version number as the tag
        npmtag: true, //default: no tag
        tagName: '<%= version %>', //default: '<%= version %>'
        github: {
          repo: 'maboiteaspam/phantomizer-etags',
          usernameVar: 'GITHUB_USERNAME',
          passwordVar: 'GITHUB_PASSWORD'
        }
      }
    },
    'phantomizer-etags': {
      options: {
      },
      "test":{
        "options":{
          path:"src/"
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-release');
  grunt.loadTasks('tasks');

  grunt.registerTask('cleanup-grunt-temp', [],function(){
    wrench.rmdirSyncRecursive(__dirname + '/.grunt', !true);
    wrench.rmdirSyncRecursive(__dirname + '/documentation', !true);
  });
  grunt.registerTask('default', ['release:patch','docco','gh-pages', 'cleanup-grunt-temp']);
  grunt.registerTask('etags', ['phantomizer-etags']);

};