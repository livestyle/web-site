/**
 * A helper task to inject Quick Tour HTML code into current page
 */
'use strict';
import fs from 'fs';
import through from 'through2';
import htmlparser from 'htmlparser2';

export default function(options) {
	return through.obj(function(file, enc, next) {
		if (file.isNull()) {
			return next(null, file);
		}

		if (file.isStream()) {
			return next(new Error('Streams are not supported'));
		}


		var contents = file.contents.toString();
		getQtCode(options, (err, code) => {
			if (err) {
				return next(err);
			}

			contents = contents.replace(/<\!\-\-\s+QUICK\s+TOUR\s+\-\->/, code);
			file.contents = new Buffer(contents);
			next(null, file);
		});
	});
};

var _qtCode = null;
function getQtCode(options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	if (_qtCode) {
		return callback(null, _qtCode);
	}

	options = options || {};
	var qtPath = options.path || './node_modules/quick-tour/index.html';
	fs.readFile(qtPath, 'utf8', (err, contents) => {
		if (err) {
			return callback(err);
		}

		var dom;
		try {
			dom = htmlparser.parseDOM(contents);
		} catch (e) {
			return callback(e);
		}

		var utils = htmlparser.DomUtils;
		var node = utils.findOne(elem => elem.attribs['class'] === 'qt', dom);
		if (node) {
			_qtCode = utils.getOuterHTML(node);
		} else {
			_qtCode = '!!!NO QT NODE!!!';
		}

		callback(null, _qtCode);
	});
}