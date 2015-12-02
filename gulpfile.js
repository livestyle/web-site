'use strict';

var path = require('path');
var buffer = require('vinyl-buffer');
var through = require('through2');
var extend = require('xtend');
var combine = require('stream-combiner2');
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var minify = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');
var jsBundle = require('./gulp-tasks/js-bundle');
var site = require('./gulp-tasks/site');
var server = require('./gulp-tasks/server');
var cssRewrite = require('./gulp-tasks/rewrite-css-url');

const isWatching = ~process.argv.indexOf('watch') || ~process.argv.indexOf('--watch');
const production = ~process.argv.indexOf('--production');
const srcOpt = {cwd: './src/www', base: './src/www'};
const destDir = './out';
const src = (pattern, options) => gulp.src(pattern, extend(srcOpt, options || {}));
const dest = options => gulp.dest(destDir, options);
const nodeModules = path.resolve(__dirname, 'node_modules');
const np = file => path.resolve(nodeModules, file);

gulp.task('js', ['worker', 'editor'], () => {
	var stream;
	return stream = src(['js/*.js', '!js/{worker,editor}.js'], {read: false})
	.pipe(js({watch: isWatching})).once('error', err => stream.emit('error', err))
	.pipe(dest());
});

gulp.task('worker', () => {
	return src('js/worker.js')
	.pipe(js({babelify: false, watch: isWatching}))
	.pipe(dest());
});

gulp.task('editor', () => {
	return src('js/editor.js')
	.pipe(jsBundle({
		babelify: false,
		noParse: [
			np('codemirror-movie/dist/movie.js'), 
			np('emmet-codemirror/dist/emmet.js'),
			np('codemirror/lib/codemirror.js')
		]
	}))
	.pipe(dest());
});

gulp.task('css', () => {
	return src('css/*.css')
	.pipe(sourcemaps.init())
	.pipe(postcss([
		require('postcss-import'),
		require('autoprefixer')({browsers: ['last 3 versions']})
	]))
	.pipe(cssRewrite())
	.pipe(production ? minify({processImport: false}) : through.obj())
	.pipe(sourcemaps.write('./'))
	.pipe(dest());
});

gulp.task('demo', () => gulp.src('./demo/**', {base: './'}).pipe(dest()));

gulp.task('server', () => server(destDir));

gulp.task('watch', ['build', 'server'], () => {
	gulp.watch('js/**/*.js', srcOpt, ['js'])
	gulp.watch('css/**/*.css', srcOpt, ['css']);
	gulp.watch('**/*.{html,eco}', srcOpt, ['site']);
});

gulp.task('site', () => site(['www/**/*.*', '!**/*.{css,js}'], '../out'));

gulp.task('full', ['build'], () => {
	return gulp.src('**/*.{html,css,js,ico,svg}', {cwd: destDir})
		.pipe(gzip({
			threshold: '1kb',
			gzipOptions: {level: 7}
		}))
		.pipe(dest());
});

gulp.task('build', ['js', 'site', 'css', 'demo']);
gulp.task('default', ['build']);

////////////// helpers

function js(options) {
	return combine.obj(
		jsBundle({watch: isWatching}),
		buffer(),
		production ? uglify() : through.obj()
	);
}