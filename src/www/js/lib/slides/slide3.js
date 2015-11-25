'use strict';

import timings from './timings';
import KeyframeClip from '../clip/keyframe';
import TextRevealClip from '../clip/text-reveal';
import DrawPathClip from '../clip/draw-path';
import ToggleClassClip from '../clip/toggle-class';
import fade from '../effects/fade';

function time(value) {
	return value + timings.slide3;
}

export default function(timeline) {
	var root = timeline.elem;
	var elem = root.querySelector('.qt-slide3');
	var text1 = '#qt-slide3-tx1';
	var text2 = '#qt-slide3-tx2';
	var line1 = '.qt-browser-line1 path';
	var line2 = '.qt-browser-line2 path';

	timeline.add(time(0), new KeyframeClip(root.querySelector('.qt-browser'), {
		0:    {x: -65, y: 300, transition: 'inOutCubic'},
		2000: {x: 10, y: 10}
	}));

	timeline.add(time(1400), new KeyframeClip(root.querySelector('.qt-livestyle'), {
		0:   {scale: 0, transition: 'outBack'},
		700: {scale: 1}
	}));

	timeline.add(time(1600), new TextRevealClip(text1, {
		duration: 2000, 
		css: {'z-index': 3}
	}));
	timeline.add(time(6600), new TextRevealClip(text2, {duration: 1500}));

	timeline.add(time(4100), new DrawPathClip(line1, {
		duration: 900, 
		transition: 'inOutCubic'
	}));

	timeline.add(time(8000), new DrawPathClip(line2, {
		duration: 900, 
		transition: 'inOutCubic'
	}));

	var kf1 = 11000;
	timeline.add(time(kf1), fade(elem));
	timeline.add(time(kf1), fade(line1));
	timeline.add(time(kf1), fade(line2));

	var kf2 = 12000;
	timeline.add(time(kf2), new ToggleClassClip('.qt-browser-line1', 'qt-hidden'));
	timeline.add(time(kf2), new ToggleClassClip('.qt-browser-line2', 'qt-hidden'));
}