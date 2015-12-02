'use strict';

var extend = require('xtend');
var cssTransform = require('css-transform');
var transformUrl = require('./rewrite-url');

module.exports = function(options) {
	return cssTransform(extend({transformUrl}), options || {});
};