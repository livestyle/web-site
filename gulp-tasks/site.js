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
					this.meta.css || [], 
					this.document.css || []
				).filter(Boolean);
			},
			js() {
				return [].concat(
					this.site.js || [], 
					this.meta.js || [], 
					this.document.js || []
				).filter(Boolean);
			},
			renderCSS: require('./assets/render-css'),
			quickTour() {
				var qtPath = path.resolve(__dirname, '../node_modules/quick-tour/index.html');
				var contents = fs.readFileSync(qtPath, 'utf8');
				var dom = htmlparser.parseDOM(contents);
				var utils = htmlparser.DomUtils;
				var node = utils.findOne(elem => elem.attribs['class'] === 'qt', dom);
				if (!node) {
					throw new Error('No quick tour code found');
				}

				return utils.getOuterHTML(node);
			}
		}
	}, options || {});

	var transform = {
		transformUrl: function(url, file, ctx) {
			if (ctx.type === 'html' && ctx.stats) {
				var node = ctx.node;
				if (node.name === 'img' && !ctx.node.width) {
					// add sizes for images for better UX
					let filePath = path.join(file.base, ctx.clean);
					try {
						let size = imageSize(filePath);
						node.attribs.width = size.width + '';
						node.attribs.height = size.height + '';
					} catch (e) {
						console.warn('Unable to get image size for', filePath);
						console.warn(e);
					}
				}
				url = '/-/' + ctx.stats.hash + url;
			}

			return url;
		}
	};

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