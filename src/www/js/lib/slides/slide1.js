'use strict';

import KeyframeClip from '../clip/keyframe';
import TextRevealClip from '../clip/text-reveal';

export default function(timeline) {
	var root = timeline.elem;
	var elem = root.querySelector('.qt-slide1');

	var text1 = elem.querySelector('.qt-text-header');
	var text2 = elem.querySelector('.qt-text');

	timeline.add(500, new KeyframeClip(text1, {
		0:     {opacity: 0},
		500:   {opacity: 1},
		5000:  {opacity: 1},
		5500:  {opacity: 0}
	}));

	timeline.add(1700, new TextRevealClip(text2, {duration: 1000}));
	timeline.add(5500, new KeyframeClip(text2, {
		0: {opacity: 1},
		500: {opacity: 0}
	}));
}