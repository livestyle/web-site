/**
 * A helper Gulp task for better Babel/Browserify build: it tracks all used 
 * Babel helpers across modules and inserts them once in a final output.
 * So, for example, a `classCreate` helper is not duplicated across all 
 * JS modules that uses ES6 Classes but inserted only once.
 */
var path = require('path');
var babel = require('babel-core');
var browserify = require('browserify');
var watchify = require('watchify');
var through = require('through2');
var extend = require('xtend');

var _bundles = {};
var iifeStart = new Buffer('(function() {');
var iifeEnd = new Buffer(';\n__babelModule();})();\n');
// use wrapping __babelModule function to retain sourcemap positions
// XXX looks like it doesn‘t help
var innerModuleStart = new Buffer('var __babelModule = function() {');
var innerModuleEnd = new Buffer('};');

const defaultOptions = {
	detectGlobals: false,
	debug: false,
	detectGlobals: false,
	babelify: true
};

module.exports = function(options) {
	return through.obj(function(file, enc, next) {
		var self = this;
		file.contents = jsBundle(file, options).on('error', function(err) {
			self.emit('error', err);
		});
		next(null, file);
	});
}

function jsBundle(file, options) {
	options = options || {};

	if (!_bundles[file.path]) {
		options = makeOptions(file, options);

		var b = browserify(options);
		if (options.watch) {
			b.plugin(watchify);
		}

		if (options.babelify) {
			b._babelHelpers = [];
			b = b.transform(babelify(b._babelHelpers, options), {global: true});
		}

		_bundles[file.path] = b;
	}

	var bundle = _bundles[file.path];
	return bundle.bundle()
	.pipe(readStream(function(contents, next) {
		this.push(iifeStart);
		this.push(innerModuleStart);
		this.push(contents);
		this.push(innerModuleEnd);
		if (bundle._babelHelpers && bundle._babelHelpers.length) {
			var helpersCode = babel.buildExternalHelpers(bundle._babelHelpers, 'var');
			this.push(new Buffer(helpersCode));
		}
		this.push(iifeEnd);
		next();
	}));
}

function makeOptions(file, options) {
	options = extend({entries: [file.path]}, defaultOptions,  options || {});

	if (options.standalone === true) {
		options.standalone = path.basename(file.path)
			.replace(/\.\w+/, '')
			.replace(/\-(\w)/g, function(str, c) {
				return c.toUpperCase();
			});
	}

	if (options.watch) {
		options = extend(options, {
			cache: {},
			packageCache: {}
		});
	}

	return options;
}

function babelify(usedHelpers, options) {
	options = extend({externalHelpers: true}, options.babel || {});
	return function(file) {
		return readStream(function(contents, next) {
			var t = babel.transform(contents, options);
			addUnique(usedHelpers, t.metadata.usedHelpers);
			this.push(t.code);
			next();
		});
	};
}

function readStream(callback) {
	var chunks = [], len = 0;
	return through(function(chunk, enc, next) {
		chunks.push(chunk);
		len += chunk.length;
		next();
	}, function(next) {
		callback.call(this, Buffer.concat(chunks, len), next);
		chunks = len = null;
	});
}

function addUnique(target, data) {
	if (Array.isArray(data)) {
		data.forEach(function(item) {
			if (target.indexOf(item) === -1) {
				target.push(item);
			}
		});
	}

	return target;
}