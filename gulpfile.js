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
  bower      = require('gulp-bower'),
  del        = require('del');

// Define some paths
var paths = {
  html: './src/index.html',
  css: './src/css/**/*.css',
  js: './src/js/**/*.js',
  buildHtml: './build',
  buildCss: './build/css',
  buildJs: './build/js'
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
    .pipe(eslint.failOnError())
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.buildJs));
});

// Install bower dependencies
gulp.task('bower', function() {
  return bower('./src/js/vendor');
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
});

// Run unit / functional tests
gulp.task('test', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

// Watch files and build
gulp.task('dev', ['serve', 'watch']);

// Default task
// Build the gulp components from scratch
gulp.task('default', ['html', 'css', 'js']);
