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
const autoprefixer = require('autoprefixer');
const nested = require('postcss-nested');
const postcssShort = require('postcss-short');
const assets  = require('postcss-assets');
const postcssPresetEnv = require('postcss-preset-env');
const glob = require('glob');
const handlebars = require('gulp-compile-handlebars'); 
const rename = require('gulp-rename');

const path = {
    css: {
        input: 'src/css/*.css',
        output: 'build/css'
    },
    js: {
        input: 'src/js/*.js',
        output: 'build/js'
    },
    templates: {
        input: 'src/templates/**/*.hbs',
        output: 'build'
    }
};

env({
    file: '.env',
    type: 'ini'
})
gulp.task('build-hbs',()=>{
    glob(path.templates.input,(err,files)=>{
        if(!err){
            const options = {
                ignorePartials: true,
                batch: files.map(item=> item.slice(0,item.lastIndexOf('/')))
            };
    
            gulp.src(`src/templates/index.hbs`)
                .pipe(handlebars({}, options))
                .pipe(rename('index.html'))
                .pipe(gulp.dest(path.templates.output))
        } else{
            console.log('error compile hbs');
        }
    });
});

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
    const plugins = [
        autoprefixer({
            browsers: ['last 1 version']
        }),
        nested(),
        postcssShort(),
        assets({
            loadPaths: ['images/']
        }),
        postcssPresetEnv({ stage: 0 })
    ];
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
            baseDir: "./build"
        }
    });
    gulp.watch(path.js.input, ['watch-js']);
    gulp.watch(path.css.input, ['watch-css']);
    gulp.watch(path.templates.input, ['watch-hbs']);
})

gulp.task('watch-js',['build-js'],()=>browserSync.reload());
gulp.task('watch-css',['build-css'],()=>browserSync.reload());
gulp.task('watch-hbs',['build-hbs'],()=>browserSync.reload());

gulp.task('prod',['build-js','build-css']);
gulp.task('dev',['build-js','build-css','browser-sync']);