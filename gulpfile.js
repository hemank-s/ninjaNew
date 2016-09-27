(function() {
    'use strict';

    var BUILD_PATH = 'build',
        STAGING_PATH = BUILD_PATH + '/staging',
        PROD_PATH = BUILD_PATH + '/prod',
        DEV_PATH = BUILD_PATH + '/dev',
        gulp = require('gulp'),
        del = require('del'),
        webpackConfig = require('./webpack.config'),
        stripLine = require('gulp-strip-line'),
        replace = require('gulp-replace'),
        sass = require('gulp-sass'),
        uglify = require('gulp-uglify'),
        minifyCss = require('gulp-minify-css'),
        Constants = require('./constants'),
        webpack = require('gulp-webpack'),
        curDate = new Date(),
        curTimeStamp = curDate.getTime();

    gulp.task('sass', ['clean'], function() {
        gulp.src('sass/app.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest(DEV_PATH + '/' + curTimeStamp))
            .pipe(gulp.dest(STAGING_PATH + '/' + curTimeStamp))
            .pipe(minifyCss())
            .pipe(gulp.dest(PROD_PATH + '/' + curTimeStamp));
    });

    gulp.task('clean', function(cb) {
        del(BUILD_PATH, cb);
    });

    gulp.task('copyImages', ['clean'], function() {
        return gulp.src('images/*')
            .pipe(gulp.dest(DEV_PATH + '/' + curTimeStamp + '/images'))
            .pipe(gulp.dest(STAGING_PATH + '/' + curTimeStamp + '/images'))
            .pipe(gulp.dest(PROD_PATH + '/' + curTimeStamp + '/images'));
    });

    gulp.task('stub', ['clean'], function() {
        return gulp.src('stub.js')
            .pipe(gulp.dest(DEV_PATH));
    });

    gulp.task('devCopy', ['clean', 'stub'], function() {
        return gulp.src('app.html')
            .pipe(replace('{{basePath}}', curTimeStamp + '/'))
            .pipe(gulp.dest(DEV_PATH));
    });

    gulp.task('stagingCopy', ['clean'], function() {
        return gulp.src('app.html')
            .pipe(replace('{{basePath}}', '{{basePath}}' + curTimeStamp + '/'))
            .pipe(stripLine('stub.js'))
            .pipe(replace('ENVIRONMENT', Constants.STAGING_ENV))
            .pipe(gulp.dest(STAGING_PATH));
    });

    gulp.task('prodCopy', ['clean'], function() {
        return gulp.src('app.html')
            .pipe(replace('{{basePath}}', '{{basePath}}' + curTimeStamp + '/'))
            .pipe(replace('staging', 'prod'))
            .pipe(stripLine('stub.js'))
            .pipe(replace('ENVIRONMENT', Constants.PROD_ENV))
            .pipe(gulp.dest(PROD_PATH));
    });

    gulp.task('js', ['clean'], function() {
        return gulp.src('app.js')
            .pipe(webpack(webpackConfig))
            .pipe(gulp.dest(DEV_PATH + '/' + curTimeStamp))
            .pipe(gulp.dest(STAGING_PATH + '/' + curTimeStamp))
            .pipe(uglify())
            .pipe(gulp.dest(PROD_PATH + '/' + curTimeStamp));
    });

    gulp.task('watch', function() {
        gulp.watch([
            'sass/*',
            'templates/**/*',
            'js/**/*'
        ], ['default']);


        return gulp.watch('sass/*', ['sass']);
    });

    gulp.task('default', ['sass', 'js', 'copyImages', 'stagingCopy', 'prodCopy', 'devCopy']);
})();