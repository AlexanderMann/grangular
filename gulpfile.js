var gulp = require('gulp');
var concat = require('gulp-concat');
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var print = require('gulp-print');
var changed = require('gulp-changed');
var clean = require('gulp-clean');

var r_coffee = "**/*.coffee";
var r_js = "**/*.js";
var r_maps = "maps/"
var routes = {
  src : "src/",
  src_to_release : "../release/",
  release : "release/"
};

// Hard Error Handling
gulp.on('err', function(err) {
  process.emit('exit');
});

process.on('exit', function() {
  process.nextTick(function() {
    process.exit(1);
  });
});

// ----
// Hard Delete

gulp.task('del', function() {
  gulp.src([routes.release], {read: false})
    .pipe(clean({force: true}));
});

// ----
// Tidying - Used for watching

flipExtname = function(path) {
  if(path.extname == '.coffee') {
    path.extname = '.js';
  } else if (path.extname == '.js') {
    path.extname = '.coffee';
  }
}

releaseClean = function(base_path) {
  return
}

gulp.task('clean', function() {
  return
  gulp.src([routes.release + r_js])
    .pipe(rename(flipExtname))
    .pipe(print())
    // This should only target those files which aren't present in src
    .pipe(changed(routes.src))
    .pipe(rename(flipExtname))
    .pipe(print())
      .pipe(clean());
});

// ----
// Building

gulp.task('js', ['clean'], function (done) {
  gulp.src([routes.src + r_coffee])
    .pipe(rename(flipExtname))
    .pipe(changed(routes.release))
    .pipe(rename(flipExtname))
    .pipe(print())
    .pipe(sourcemaps.init())
      .pipe(coffee({bare: true}).on('error', gutil.log))
      .on('error', function(done) {throw 'COFFEESCRIPT_ERROR';})
      .pipe(ngAnnotate())
    .pipe(sourcemaps.write(routes.src_to_release + r_maps))
    .pipe(gulp.dest(routes.release))
    .on('end', done);
});

gulp.task('build', ['js'], function (done) {
  gulp.src([routes.release + '**/grangularExampleNgApp.js', routes.release + r_js, '!' + routes.release + 'grangularExampleConcatNgApp.js', '!' + routes.release + r_maps + '**/*'])
      .pipe(sourcemaps.init({loadMaps: true}))
      	.pipe(concat('grangularExampleConcatNgApp.js'))
      	.pipe(gulp.dest(routes.dash.angular.release))
      .pipe(sourcemaps.write(r_maps))
    .pipe(gulp.dest(routes.dash.angular.release))
    .on('end', done);
});

gulp.task('release', ['del'], function(done) {
  gulp.src([routes.src + '**/grangularExampleNgApp.coffee', routes.src + r_js])
      .pipe(coffee({bare: true}).on('error', gutil.log))
      .on('error', function(done) {throw 'COFFEESCRIPT_ERROR';})
      .pipe(ngAnnotate())
      .pipe(concat('grangularExampleConcatNgApp.js'))
    .pipe(gulp.dest(routes.release))
    .on('end', done);
});

gulp.task('watch', function () {
  gulp.watch([routes.src + r_coffee], ['dash-build']);
});

gulp.task('default', ['build']);
