'use strict';

import KeyframeClip from '../clip/keyframe';
import extend from 'xtend';

var defaultOptions = {
	duration: 300,
	direction: 'out'
};

export default function(elem, options) {
	if (typeof options === 'number') {
		options = {duration: options};
	}

	options = extend(defaultOptions, options || {});
	var out = options.direction === 'out';
	return new KeyframeClip(elem, {
		0: {opacity: out ? 1 : 0},
		[options.duration]: {opacity: out ? 0 : 1}
	});
};
