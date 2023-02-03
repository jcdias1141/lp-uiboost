//CONFIGURAÇÃO DO GULP
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify'); 
//Compilando o Sass e adicionando ao prefixer e adicionando na pagina
function compilaSass() {
    return gulp.src('scss/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('css/'))
        .pipe(browserSync.stream());
}
//tarefa do sass
gulp.task('sass', compilaSass);

function pluginsCSS() {
    return gulp.src('css/lib/*.css')
    .pipe(concat('plugins.css'))
    .pipe(gulp.dest('css/'))
    .pipe(browserSync.stream())
}
gulp.task('pluginscss', pluginsCSS);

//função gulp js
function gulpJs() {
    return gulp.src('js/scripts/*.js')
        .pipe(concat('all.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('js/'))
        .pipe(browserSync.stream());
}
gulp.task('all.js', gulpJs);

function pluginsJs() {
    return gulp
    .src(['./js/lib/aos.js' , './js/lib/swiper-bundle.min.js'])
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream());
}
gulp.task('pluginjs', pluginsJs);

//função do browser
function browser() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
}
//tarefa do browserSync
gulp.task('browser-sync', browser);

//função do watch para  alterações  em scss e html
function watch() {
    gulp.watch('scss/*.scss', compilaSass);
    gulp.watch('css/lib/*.css', pluginsCSS);
    gulp.watch('*.html').on('change', browserSync.reload);
    gulp.watch('js/scripts/*js', gulpJs);
    gulp.watch('js/lib/*.js', pluginsJs);
}
//tarefa do watch
gulp.task('watch', watch);

//tarefas default que executam o watch e browserSync
gulp.task('default', gulp.parallel('watch', 'browser-sync', 'sass', 'pluginscss', 'all.js', 'pluginjs'));