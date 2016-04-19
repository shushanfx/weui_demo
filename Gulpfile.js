// Load some modules which are installed through NPM.
var fs = require("fs");
var path = require("path");
var gulp = require('gulp');
var browserify = require('browserify');  // Bundles JS.
var del = require('del');  // Deletes files.
var reactify = require('reactify');  // Transforms React JSX to JS.
var babelify = require("babelify");
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var watch = require("gulp-watch");
var minifiy = require("minify");
var gutil = require("gulp-util");


// Define some paths.
var baseDir = "./src/view/";
var baseDest = "./static/js/view";

// An example of a dependency task, it will be run before the css/js tasks.
// Dependency tasks should call the callback to tell the parent task that
// they're done.
gulp.task('view_clean', function() {
  del([baseDest + "/*"]);
});




// Our JS task. It will Browserify our code and compile React JSX files.
gulp.task('view_compile', ['view_clean'], function() {
  // Browserify/bundle the JS.
  var list = fs.readdirSync(baseDir);
  
  list.forEach(function(value) {
      var newDir = path.join(baseDir, value , "/index.js");
      var isExist = fs.existsSync(newDir);
      if(isExist){
            browserify(newDir)
            .transform(reactify)
            .transform(babelify)
            .bundle()
            .pipe(source(value + ".js"))
            // .pipe(streamify(uglify()))
            .pipe(gulp.dest(baseDest));    
      }
  });
});

// Rerun tasks whenever a file changes.
gulp.task('watch', function() {
    watch([path.join(baseDir, "**/*.js"), path.join(baseDir + "**/*.jsx")], function(eventObject){
        var str = path.join(eventObject.cwd, baseDir);
        var realName = str;
        var iCount = 0;
        str = eventObject.path.replace(str, ""); 
        realName = str.split(path.sep);
        while(iCount < realName && !realName[iCount]){
            iCount ++;
        }
        realName = realName[iCount];
        gutil.log(eventObject.path + " has changed...");
        registerTimer(realName);
    });
});

var currentTimer = {};
function registerTimer(value){
    if(currentTimer[value]){
        clearTimeout(currentTimer[value]);
    }            
    currentTimer[value] = setTimeout(function(){
      var newDir = path.join(baseDir, value , "/index.js");
      var isExist = fs.existsSync(newDir);
      if(isExist){
            browserify(newDir)
            .transform(reactify)
            .bundle()
            .pipe(source(value + ".js"))
            // .pipe(streamify(uglify()))
            .pipe(gulp.dest(baseDest));    
      }    
    }, 500);
}

// The default task (called when we run `gulp` from cli)
gulp.task('default', ['view_compile', 'watch']);