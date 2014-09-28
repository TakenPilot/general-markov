var gulp = require('gulp'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  uglify = require('gulp-uglify'),
  buffer = require('vinyl-buffer'),
  rename = require('gulp-rename');

gulp.task('js', function () {
  return browserify('./').bundle()
    .pipe(source('markov.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist'))
    .pipe(rename('markov.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['js']);