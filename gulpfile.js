var gulp = require('gulp');
const { src, dest, series } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const gulpIf = require('gulp-if');
const sort = require('gulp-sort');

// this launches a browser and watches for any changes
function watch() {
    browserSync.init({
        proxy: 'http://localhost:8888/Think-Huge/public_html/',
    });

    // watching scss' files and if any change run style function 
    gulp.watch('./src/**/*.scss', compileSCSS);
    // watching any html changes and reloading browser 
    gulp.watch('./public_html/**/*.html').on('change', browserSync.reload);
    // watching for any js changes in src file and recompiling 
    gulp.watch('./src/**/*.js', compileJS);
    // reloading the browser on any src js changes 
    gulp.watch('./src/**/*.js').on('change', browserSync.reload);
}

// compile SCSS and update browser on any changes
function compileSCSS() {
    return src('./src/**/*.scss')
        .pipe(gulpIf(file => file.contents.toString().includes('sort-last'), sort()))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(dest('./public_html/css'))
        .pipe(browserSync.stream());
}


// compile JS and update browser on any changes
function compileJS() {
    return src('./public_html/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('script.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(dest('./public_html/js'))
        .pipe(browserSync.stream());
}

// individual functions to run 
exports.watch = watch;

// hit gulp and this will run all of the functions 
exports.default = series(compileJS, compileSCSS, watch);

