const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

const path = {
    css: {
        input: 'src/css/*.css',
        output: 'build/css'
    },
    js: {
        input: 'src/js/*.js',
        output: 'build/js'
    }
}

gulp.task('js',()=>{
    return gulp.src(path.js.input)
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(gulp.dest(path.js.output));
});

gulp.task('css',()=>{
    return gulp.src(path.css.input)
    .pipe(gulp.dest(path.css.output));
});

gulp.task('build',()=>{
    return gulp.src(path.js.input)
    .pipe(concat('common.min.js'))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest(path.js.output));
})