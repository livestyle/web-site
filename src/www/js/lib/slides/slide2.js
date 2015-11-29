'use strict';

import timings from './timings';
import KeyframeClip from '../clip/keyframe';
import TextRevealClip from '../clip/text-reveal';
import ToggleClassClip from '../clip/toggle-class';
import focusRing from '../effects/focus-ring';
import fade from '../effects/fade';

function time(value) {
	return value + timings.slide2;
}

export default function(timeline) {
	var root = timeline.elem;
	var elem = root.querySelector('.qt-slide2');
	var text = elem.querySelector('.qt-text');

	timeline.add(time(0), new TextRevealClip(text, {duration: 3000}));

	timeline.add(time(400), new KeyframeClip(root.querySelector('.browser'), {
		0:    {x: -365, y: 700, rotate: -45, transition: 'inOutCubic'},
		1500: {x: -65, y: 300, rotate: 0}
	}));

	timeline.add(time(600), new KeyframeClip(root.querySelector('.editor'), {
		0:    {x: 900, y: 700, rotate: 45, transition: 'inOutCubic'},
		1500: {x: 580, y: 300, rotate: 0}
	}));

	timeline.add(time(4000), focusRing('#qt-browser-fr1'));
	timeline.add(time(4200), focusRing('#qt-browser-fr2'));
	timeline.add(time(4400), focusRing('#qt-browser-fr3'));

	var kf1 = 6500;
	timeline.add(time(kf1), new ToggleClassClip('#qt-browser-fr1', 'qt-hidden'));
	timeline.add(time(kf1), new ToggleClassClip('#qt-browser-fr2', 'qt-hidden'));
	timeline.add(time(kf1), new ToggleClassClip('#qt-browser-fr3', 'qt-hidden'));
	timeline.add(time(kf1), fade(elem));
}