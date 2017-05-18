(() => {

  const autoprefixer = require('gulp-autoprefixer')
  const babelify = require('babelify')
  const browserify = require('browserify')
  const buffer = require('vinyl-buffer')
  const clean = require('gulp-clean')
  const concat = require('gulp-concat')
  const csso = require('gulp-csso')
  const gulp = require('gulp')
  const runSequence = require('run-sequence')
  const sass = require('gulp-sass')
  const source = require('vinyl-source-stream')
  const uglify = require('gulp-uglify')


  gulp.task('default', () => runSequence('rm', ['manifest', 'icons', 'dependencies-js', 'dependencies-css', 'js', 'scss']))


  gulp.task('rm', () => {
    return gulp.src('./ext', {read: false})
    .pipe(clean({force: true}))
  }) // rm

  gulp.task('manifest', () => {
    return gulp.src('./manifest.json')
    .pipe(gulp.dest('./ext'))
  }) // manifest

  gulp.task('icons', () => {
    return gulp.src(['./filter_16.png', './filter_48.png', './filter_128.png'])
    .pipe(gulp.dest('./ext'))
  }) // icons

  gulp.task('dependencies-js', () => {
    return gulp.src(['./wNumb.js', './nouislider.min.js'])
    .pipe(gulp.dest('./ext'))
  }) // dependencies-js

  gulp.task('dependencies-css', () => {
    return gulp.src('./nouislider.min.css')
    .pipe(gulp.dest('./ext'))
  }) // dependencies-css

  gulp.task('js', () => {
    return browserify('./ext.js')
    .transform(babelify, { presets: ['latest'] })
    .bundle()
    .on('error', console.error.bind(console))
    .pipe(source('ext.js'))
    .pipe(buffer())
    // .pipe(uglify())
    .pipe(gulp.dest('./ext'))
  }) // js

  gulp.task('scss', () => {
    return gulp.src('./style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 versions', '> 1%'],
        cascade: false
    }))
    // .pipe(csso())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./ext'))
  }) // scss

})()
