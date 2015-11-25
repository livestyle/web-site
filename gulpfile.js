'use strict';

var path = require('path');
var buffer = require('vinyl-buffer');
var through = require('through2');
var extend = require('xtend');
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var minify = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');
var jsBundle = require('./gulp-tasks/js-bundle');
var site = require('./gulp-tasks/site');
var server = require('./gulp-tasks/server');

const isWatching = ~process.argv.indexOf('watch') || ~process.argv.indexOf('--watch');
const production = ~process.argv.indexOf('--production');
const dest = './out';
const srcOpt = {cwd: './src/www', base: './src/www'};

gulp.task('js', () => {
	var stream;
	return stream = gulp.src('js/*.js', extend(srcOpt, {read: false}))
	.pipe(jsBundle({watch: isWatching})).once('error', err => stream.emit('error', err))
	.pipe(buffer()).once('error', err => stream.emit('error', err))
	.pipe(production ? uglify() : through.obj())
	.pipe(gulp.dest(dest));
});

gulp.task('css', () => {
	return gulp.src('css/*.css', srcOpt)
	.pipe(sourcemaps.init())
	.pipe(postcss([
		require('postcss-import'),
		require('autoprefixer')({browsers: ['last 3 versions']})
	]))
	.pipe(production ? minify({processImport: false}) : through.obj())
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(dest));
});

gulp.task('demo', () => gulp.src('./demo/**', {base: './'}).pipe(gulp.dest('./out')));

gulp.task('server', () => server('./out'));

gulp.task('watch', ['build', 'server'], () => {
	gulp.watch('js/**/*.js', srcOpt, ['js'])
	gulp.watch('css/**/*.css', srcOpt, ['css']);
	gulp.watch('**/*.{html,eco}', srcOpt, ['site']);
});

gulp.task('site', () => site(['www/**/*.*', '!**/*.{css,js}'], '../out'));

gulp.task('full', ['build'], () => {
	return gulp.src('**/*.{html,css,js,ico}', {cwd: dest})
		.pipe(gzip({
			threshold: '1kb',
			gzipOptions: {level: 7}
		}))
		.pipe(gulp.dest(dest));
});

gulp.task('build', ['js', 'site', 'css', 'demo']);
gulp.task('default', ['build']);