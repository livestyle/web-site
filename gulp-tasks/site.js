/**
 * A task for rendering static site
 */
'use strict';

import fs from 'fs';
import path from 'path';
import through from 'through2';
import extend from 'xtend';
import marked from 'marked';
import eco from 'eco';
import ssg from 'static-site-generator';
import htmlTransform from 'html-transform';
import combine from 'stream-combiner';

var htmlparser = htmlTransform.htmlparser;

export default function(src, dest, options) {
	options = extend({
		cwd: path.resolve(__dirname, '../src'),
		context: {
			site: {
				title: 'Emmet LiveStyle — bi-directional live edit tool for CSS, LESS and SCSS'
			},
			css() {
				return [].concat(
					this.site.css || [], 
					this.meta.css || [], 
					this.document.css || []
				).filter(Boolean);
			},
			quickTour() {
				var qtPath = path.resolve(__dirname, '../node_modules/quick-tour/index.html');
				var contents = fs.readFileSync(qtPath, 'utf8');
				var dom = htmlparser.parseDOM(contents);
				var utils = htmlparser.DomUtils;
				var node = utils.findOne(elem => elem.attribs['class'] === 'qt', dom);
				if (!node) {
					return '!!!NO QT NODE!!!';
				}

				return utils.getOuterHTML(node);;
			}
		},
		renderer: {
			'md': function(ctx) {
				return new Buffer(marked(ctx.content.toString()));
			},
			'eco': function(ctx, file) {
				return new Buffer(eco.render(file.contents.toString(), ctx));
			}
		}
	}, options || {});

	var transform = {
		transformUrl: function(url, file, ctx) {
			if (ctx.type === 'html' && ctx.stats) {
				url = '/-/' + ctx.stats.hash + url;
			}
			return url;
		}
	};

	return combine(
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