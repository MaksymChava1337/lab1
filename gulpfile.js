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

