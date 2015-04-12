// Required modules
var gulp     = require('gulp'),
  htmlhint   = require('gulp-htmlhint'),
  csslint    = require('gulp-csslint'),
  eslint     = require('gulp-eslint'),
  minifyHTML = require('gulp-minify-html'),
  minifyCSS  = require('gulp-minify-css'),
  uglify     = require('gulp-uglify'),
  concat     = require('gulp-concat'),
  watch      = require('gulp-watch'),
  connect    = require('gulp-connect'),
  karma      = require('karma').server,
  imageop    = require('gulp-image-optimization'),
  del        = require('del');

// Define some paths
var paths = {
  html: './src/index.html',
  css: './src/css/**/*.css',
  js: './src/js/**/*.js',
  data: './src/data/**/*.json',
  buildHtml: './build',
  buildCss: './build/css',
  buildJs: './build/js',
  buildData: './build/data'
};

// Clean the build directory
gulp.task('clean', function(done) {
  del(['./build'], done);
});

// HTML
gulp.task('html', function() {
  return gulp.src(paths.html)
    .pipe(htmlhint())
    .pipe(minifyHTML())
    .pipe(gulp.dest(paths.buildHtml));
});

// CSS
gulp.task('css', function() {
  return gulp.src(paths.css)
    .pipe(csslint('.csslintrc'))
    .pipe(csslint.reporter())
    .pipe(concat('styles.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.buildCss));
});

// Javascript
gulp.task('js', function() {
  return gulp.src(paths.js)
    .pipe(eslint({configFile: '.eslintrc'}))
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.buildJs));
});

gulp.task('images', function(cb) {
    gulp.src(['src/**/*.png','src/**/*.jpg','src/**/*.gif','src/**/*.jpeg']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest(paths.buildHtml)).on('end', cb).on('error', cb);
});

// Copy data files to build directory
gulp.task('copy', function() {
  gulp.src([paths.data])
  .pipe(gulp.dest(paths.buildData));
});

// Development Server
gulp.task('serve', function() {
  connect.server({
    root: 'build',
    liveReload: true
  });
});

// Run actions on file changes
gulp.task('watch', function() {
  gulp.watch([paths.html], ['html']);
  gulp.watch([paths.css], ['css']);
  gulp.watch([paths.js], ['js']);
  gulp.watch([paths.data], ['copy']);
});

// Run unit / functional tests
gulp.task('test', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

// Watch files and build
gulp.task('dev', ['serve', 'watch']);

// Default task; build the gulp components from scratch
gulp.task('default', ['html', 'css', 'js', 'images', 'copy']);
