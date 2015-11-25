'use strict';

import KeyframeClip from '../clip/keyframe';

export default function(elem) {
	return new KeyframeClip(elem, {
		0: {scale: [0, 'outExpo'], opacity: 0},
		200: {opacity: 0.7},
		800: {scale: 1},
		600: {opacity: 0.7},
		750: {opacity: 0}
	});
};
