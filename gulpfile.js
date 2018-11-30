const gulp = require('gulp');

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
    .pipe(gulp.dest(path.js.output));
});

gulp.task('css',()=>{
    return gulp.src(path.css.input)
    .pipe(gulp.dest(path.css.output));
});