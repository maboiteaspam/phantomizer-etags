'use strict';

module.exports = function(grunt) {

  var wrench = require('wrench');
  var path = require("path");
  var fs = require("fs");
  var crypto = require('crypto');
  var ProgressBar = require('progress');


  grunt.registerMultiTask("phantomizer-etags",
    "Generates apache/nginx etags headers for phantomizer app", function(){

      var options = this.options({
        src:"src/",
        format:{
          "apache":"etags.apache.include",
          "nginx":"etags.nginx.include"
        },
        output:"output/"
      });

      var async = this.async();
      var finish = function(){
        grunt.log.ok();
        async(true);
      }

      grunt.file.mkdir(options.output);
      var curFiles = wrench.readdirSyncRecursive( options.src );
      var curLength = 0;
      var files_etags = {};


// initialize a progress bar
      var bar = new ProgressBar(' done=[:current/:total] elapsed=[:elapseds] sprint=[:percent] eta=[:etas] [:bar]', {
        complete: '#'
        , incomplete: '-'
        , width: 80
        , total: curFiles.length
      });



      for( var n in curFiles ){
        var f = options.src+curFiles[n];
        if( grunt.file.exists(f) ){
          sha1_file(options.src, curFiles[n],function(relfile, f, d){
            files_etags[f] = {
              url:relfile,
              etag:d
            };
            bar.tick();
            curLength++;
            if( curLength == curFiles.length ){
              for( var n in options.format){
                if( n == "apache"){
                  export_apache(files_etags, options.output+options.format[n]);
                }else{
                  export_nginx(files_etags, options.output+options.format[n]);
                }
              }
              finish();
            }
          })
        }else{
          bar.tick();
          curLength++;
        }
      }

    });

  function export_apache(files_etags,output_file){

    var eol = "\n";
    var tab = "\t";
    var output = "";

    for( var file in files_etags ){
      var url = files_etags[file].url;
      var etag = files_etags[file].etag;

      url = url.substr(0,1)=="/"?url:"/"+url;

      output += '<Location "'+url+'">' + eol;
      output += tab+'Header set ETag "'+etag+'"' + eol;
      output += '</Location>' + eol;
    }
    grunt.file.write(output_file, output);
  }
  function export_nginx(files_etags,output_file){

    var eol = "\n";
    var tab = "\t";
    var output = "";

    for( var file in files_etags ){
      var url = files_etags[file].url;
      var etag = files_etags[file].etag;

      url = url.substr(0,1)=="/"?url:"/"+url;

      output += 'location '+url+' {' + eol;
      output += tab+'add_header ETag '+etag+'' + eol;
      output += '}' + eol;
    }
    grunt.file.write(output_file, output);
  }
  function sha1_file(base_url, relfile, then){
// change the algo to sha1, sha256 etc according to your requirements
    var algo = 'sha1';
    var shasum = crypto.createHash(algo);

    var file = base_url+relfile;
    var enc = file.match("[.](css|html|htm|js|txt|appcache|manifest|xml|json)")?'utf8':null;
    fs.readFile(file, enc, function (err,data) {
      if (err) {
        return console.log(err);
      }
      shasum.update( data );
      then(relfile, file, shasum.digest('hex'));
    });
  }
};