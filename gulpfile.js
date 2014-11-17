var gulp = require('gulp');
var concat = require('gulp-concat');
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var print = require('gulp-print');
var del = require('del');
var cached = require('gulp-cached');
var remember = require('gulp-remember');
var gulpif = require('gulp-if');
var ignore = require('gulp-ignore');

isProd = function() {
  return gutil.env.e === 'prod';
}
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

gulp.task('del', function(done) {
  if(isProd) {
    del(routes.release, done);
  } else {
    done();
  }
});

// ----
// Building

gulp.task('build', ['del'], function (done) {
  gulp.src([routes.src + '**/grangularExampleNgApp.coffee', routes.src + r_coffee, routes.src + r_js])
      .pipe(cached('build'))
        .pipe(print())
        .pipe(gulpif(!isProd(), sourcemaps.init()))
          .pipe(gulpif(/.*\.coffee/, coffee({bare: true}).on('error', gutil.log)))
          .on('error', function(done) {throw 'COFFEESCRIPT_ERROR';})
          .pipe(ngAnnotate())
        .pipe(gulpif(!isProd(), sourcemaps.write(routes.src_to_release + r_maps)))
      .pipe(ignore.exclude(/.*\.map/))
      .pipe(remember('build'))
        .pipe(gulpif(isProd(), sourcemaps.init({loadMaps: true})))
          .pipe(concat('grangularExampleNgConcatApp.js'))
        .pipe(gulpif(isProd(), sourcemaps.write(r_maps)))
    .pipe(gulp.dest(routes.release))
    .on('end', done);
});

gulp.task('watch', function () {
  //watching for js changes so that we can move infixParser Services to the release directory
  watcher = gulp.watch([routes.src + r_coffee, routes.src + r_js], ['build']);
  watcher.on('change', function(event) {
    if(event.type === 'deleted') {
      delete cache.caches['build'][event.path];
      cloned_path = JSON.parse(JSON.stringify(event.path));
      cloned_path.extname = '.js';
      remember.forget('build', cloned_path);
    }
  });
});

gulp.task('default', ['help']);

gulp.task('help', function() {
  console.log();
  console.log();
  console.log('-> means `command points to`, : means `command performs`');
  console.log();
  console.log('------ Grangular Gulp Commands ------');
  console.log('default -> help');
  console.log('build -> [del] : optional parameter of -e "prod" for prod release. Builds the application.');
  console.log('del : Deletes the release folder. Use this when things are out of sorts, or you need to remove all of the release.');
  console.log('------ Watchers ------');
  console.log('watch : Watches for any changes in the package and performs `build`. Use this for when you are actively in the development enironment. Runs slowly the first time, and fast all other times.');
  console.log('------ Help ------');
  console.log('h -> help : Presents this output.');
  console.log();
  console.log();
});
gulp.task('h', ['help'], function() {});
