const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');
const rename = require('gulp-rename'); 

const paths = {
  styles: {
    src: 'app/scss/**/*.scss',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'app/js/**/*.js',
    dest: 'dist/js/'
  },
  images: {
    src: 'app/img/*',
    dest: 'dist/img/'
  },
  html: {
    src: 'app/*.html',
    watch: 'app/**/*.html', 
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
    return src(paths.images.src, {encoding: false})
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
            baseDir: './dist' //тут була помилка, написав не baseDir, а daseDir XDXDXDXDXD
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