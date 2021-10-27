import gulp from 'gulp'
import babel from 'gulp-babel'
import terser from 'gulp-terser'
import postcss from 'gulp-postcss'
import concat from 'gulp-concat'
import htmlmin from 'gulp-htmlmin'
import imagemin from 'gulp-imagemin'
import pug from 'gulp-pug'
import stylus from 'gulp-stylus'
import clean from 'gulp-purgecss'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'
import { init as server, stream, reload } from 'browser-sync'
import plumber from 'gulp-plumber'


const production = false

const cssPlugins = [
    cssnano(),
    autoprefixer()
]


gulp.task('html-min',() => {
    return gulp
        .src('./src/*.html')
        .pipe(plumber())
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('./public'))
})

gulp.task('styles', () => {
    return gulp
      .src('./src/css/*.css')
      .pipe(plumber())
      .pipe(concat('styles-min.css'))
      .pipe(postcss(cssPlugins))
      .pipe(gulp.dest('./public/css'))
      .pipe(stream());
  });

gulp.task('stylus',() => {
    return gulp
        .src('./src/stylus/estilos.styl')
        .pipe(plumber())
        .pipe(stylus({
            compress: true 
        }))
        .pipe(postcss(cssPlugins))
        .pipe(gulp.dest('./public/css'))
        .pipe(stream());
})


gulp.task('views',() => {
    return gulp
        .src('./src/views/*.pug')
        .pipe(plumber())
        .pipe(pug({
            pretty: production ? false : true
        }))
        .pipe(gulp.dest('./public'))
})

gulp.task('babel',() => {
    return gulp
        .src('./src/js/*.js')
        .pipe(plumber())
        .pipe(concat('scripts-min.js'))
        .pipe(babel())
        .pipe(terser())
        .pipe(gulp.dest('./public/js'))
})

gulp.task('clean',() => {
    return gulp
        .src('./public/css/styles.css')
        .pipe(plumber())
        .pipe(clean({
            content: ['./public/*.html']
        }))
        .pipe(gulp.dest('./public/css'))
    })

gulp.task('generateImage',() => {
    return gulp
        .src('./src/img/*.{png,jpg,jpeg,gif,svg}')
        .pipe(imagemin())
        .pipe(gulp.dest('./public/img'))
})

gulp.task('default', () => {
    server({
        server: './public'
    })
    gulp.watch('./src/views/**/*.pug', gulp.series('views')).on('change',reload)
    gulp.watch('./src/stylus/**/*.styl', gulp.series('stylus')).on('change',reload)
    gulp.watch('./src/img/*.{png,jpg,jpeg,gif,svg}', gulp.series('generateImage')).on('change',reload)
    gulp.watch('./src/js/*.js', gulp.series('babel')).on('change',reload)
})