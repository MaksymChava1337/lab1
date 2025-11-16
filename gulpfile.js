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
  },
  // Додамо шляхи до файлів Bootstrap, щоб було чисто
  bootstrap: {
    css: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
    js: [
        'node_modules/@popperjs/core/dist/umd/popper.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js'
    ]
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

function copyBootstrapCSS() {
  return src(paths.bootstrap.css)
    .pipe(dest(paths.styles.dest)); 
}

function copyBootstrapJS() {
  return src(paths.bootstrap.js)
    .pipe(dest(paths.scripts.dest)); 
}

function reload(cb) {
  browserSync.reload();
  cb();
}

function watchTask(){
    browserSync.init({
        server:{
            baseDir: './dist' 
        },
        notify: false
    });

  watch(paths.styles.src, series(styles, reload));
  watch(paths.scripts.src, series(scripts, reload));
  watch(paths.images.src, series(images, reload));
  watch(paths.html.watch, series(html, reload));
  // Можна додати й watch для файлів Bootstrap, але це не обов'язково
}

// Створимо один таск для копіювання, так зручніше
const copyBootstrap = parallel(copyBootstrapCSS, copyBootstrapJS);

// ЗМІНЕНО: Додаємо 'copyBootstrap' до паралельної збірки
exports.build = series(clean, parallel(styles, scripts, images, html, copyBootstrap));
exports.default = series(exports.build, watchTask);