import path from 'path';
import buffer from 'vinyl-buffer';
import through from 'through2';
import extend from 'xtend';
import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import minify from 'gulp-minify-css';
import uglify from 'gulp-uglify';
import gzip from 'gulp-gzip';
import jsBundle from './gulp-tasks/js-bundle';
import site from './gulp-tasks/site';

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

gulp.task('watch', ['build'], () => {
	gulp.watch('js/**/*.js', srcOpt, ['js']);
	gulp.watch('**/*.html', srcOpt, ['html']);
	gulp.watch('css/**', srcOpt, ['css']);
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