const gulp = require('gulp');
const env = require('gulp-env');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
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

env({
    file: '.env',
    type: 'ini'
})

gulp.task('build-js',()=>{
    return gulp.src(path.js.input)
    .pipe(sourcemaps.init())
    .pipe(concat('common.min.js'))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(gulpif(process.env.NODE_ENV === 'production' ,uglify()))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.js.output));
})

gulp.task('build-css',()=>{
    const plugins = [];
    return gulp.src(path.css.input)
    .pipe(sourcemaps.init())
    .pipe(postcss(plugins))
    .pipe(concat('style.min.css'))
    .pipe(gulpif(process.env.NODE_ENV === 'production' ,cssnano()))
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