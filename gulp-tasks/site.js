/**
 * A task for rendering static site
 */
'use strict';

var fs = require('fs');
var path = require('path');
var through = require('through2');
var extend = require('xtend');
var marked = require('marked');
var eco = require('eco');
var ssg = require('static-site-generator');
var htmlTransform = require('html-transform');
var combine = require('stream-combiner2');
var highlight = require('highlight.js');
var imageSize = require('image-size');
var transformUrl = require('./rewrite-url');

var htmlparser = htmlTransform.htmlparser;
marked.setOptions({
	highlight(code) {
		return highlight.highlightAuto(code).value;
	}
});

ssg.render.register('md', ctx => new Buffer(marked(ctx.content.toString())));
ssg.render.register('eco', (ctx, file) => new Buffer(eco.render(file.contents.toString(), ctx)));

module.exports = function(src, dest, options) {
	options = extend({
		cwd: path.resolve(__dirname, '../src'),
		context: {
			site: {
				title: 'Emmet LiveStyle — the first bi-directional real-time edit tool for CSS, LESS and SCSS'
			},
			css() {
				return [].concat(
					this.site.css || [], 
					this.meta.css || []
				).filter(Boolean);
			},
			js() {
				return [].concat(
					this.site.js || [], 
					this.meta.js || []
				).filter(Boolean);
			},
			renderCSS: require('./assets/render-css')
		}
	}, options || {});

	var transform = {transformUrl};

	return combine.obj(
		ssg.src(src, options),
		ssg.generate(options),
		// add cache-busting prefix for static files
		through.obj(function(file, enc, next) {
			if (path.extname(file.relative) === '.html') {
				htmlTransform.process(file, transform, next);
			} else {
				next(null, file);
			}
		}),
		ssg.dest(dest, options)
	);
};