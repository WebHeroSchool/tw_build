const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

const path = {
    css: {
        input: 'src/css/*.css',
        output: 'build/css'
    },
    js: {
        input: 'src/js/*.js',
        output: 'build/js'
    },
    html: {
        input: '*.html'
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

gulp.task('default',['build-js','build-css']);


gulp.task('browser-sync',()=>{
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch(path.js.input, ['watch-js']);
    gulp.watch(path.css.input, ['watch-css']);
    gulp.watch(path.html.input, ['watch-html']);
})

gulp.task('watch-js',['build-js'],()=>browserSync.reload());
gulp.task('watch-css',['build-css'],()=>browserSync.reload());
gulp.task('watch-html',()=>browserSync.reload());

gulp.task('prod',['build-js','build-css']);
gulp.task('dev',['build-js','build-css','browser-sync']);