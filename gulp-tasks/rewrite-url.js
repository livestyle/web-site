'use strict';

var path = require('path');
var imageSize = require('image-size');

module.exports = function(url, file, ctx) {
	if (ctx.stats) {
		if (ctx.type === 'html') {
			let node = ctx.node;
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
		}
		url = '/-/' + ctx.stats.hash + url;
	}

	return url;
}