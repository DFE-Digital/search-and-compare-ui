/// <binding AfterBuild='default' />

'use strict';

const gulp = require('gulp');
const configPaths = require('./Config/paths.json');
const runSequence = require('run-sequence');
const clean = require('gulp-clean');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('clean', function () {
  return gulp.src(configPaths.public + '/**/*', {
      read: false
    })
    .pipe(clean())
});

gulp.task('sass', function () {
  return gulp.src(configPaths.assets + '/Styles/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(configPaths.public + '/css/'))
});

gulp.task('copy-fonts', function () {
  return gulp.src(configPaths.nodeModules + 'assets/fonts/*')
    .pipe(gulp.dest(configPaths.public + '/fonts/'))
});

gulp.task('copy-images', function () {
  return gulp.src([configPaths.nodeModules + 'assets/images/*', configPaths.assets + 'Images/*'])
    .pipe(gulp.dest(configPaths.public + '/images/'))
});

gulp.task('copy-scripts', function () {
  return gulp.src([configPaths.nodeModules + 'all.js', configPaths.assets + 'Javascript/*'])
    .pipe(gulp.dest(configPaths.public + '/scripts/'))
});

gulp.task('generate-assets', function (done) {
  runSequence('clean',
              'sass',
              'copy-fonts',
              'copy-images',
              'copy-scripts', done)
})

gulp.task('default', function (done) {
  runSequence('generate-assets', done)
})
