const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');

const paths = {
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'dist/js/'
  },
  images: {
    src: 'src/img/*',
    dest: 'dist/img/'
  },
  html: {
    src: 'src/*.html',
    watch: 'src/**/*.html', 
    dest: 'dist/'
  }
};

function clean(){
    return del('dist');
}

function styles(){
    return src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(dest(paths.styles.dest))
}

function scripts(){
    return src(paths.scripts.src)
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(dest(paths.scripts.dest))
}

function images(){
    return  src(paths.images.src)
    .pipe(imagemin())
    .pipe(dest(paths.images.dest))
}

function html(){
    return src(paths.html.src)
    .pipe(fileInclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(dest(paths.html.dest))
}

function watchTask(){
    browserSync.init({
        server:{
            daseDir: './dist'
        },
        notify: false
    });

    watch(paths.styles.src, styles);
    watch(paths.scripts.src, scripts);
    watch(paths.images.src, images);
    watch(paths.html.watch, html);
}

exports.build = series(clean, parallel(styles, scripts, images, html));
exports.default = series(exports.build, parallel(watchTask));