const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');

const path = {
    css: {
        input: 'src/css/*.css',
        output: 'build/css'
    },
    js: {
        input: 'src/js/*.js',
        output: 'build/js'
    }
};

gulp.task('build-js',()=>{
    return gulp.src(path.js.input)
    .pipe(sourcemaps.init())
    .pipe(concat('common.min.js'))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.js.output));
})

gulp.task('build-css',()=>{
    return gulp.src(path.css.input)
    .pipe(sourcemaps.init())
    .pipe(concat('style.min.css'))
    .pipe(cssnano())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.css.output));
})

gulp.task('default',['build-js','build-css'])