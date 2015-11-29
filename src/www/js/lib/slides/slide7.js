'use strict';

import timings from './timings';
import KeyframeClip from '../clip/keyframe';
import TextRevealClip from '../clip/text-reveal';
import TextInputClip from '../clip/text-input';
import ToggleClassClip from '../clip/toggle-class';
import fade from '../effects/fade';

function time(value) {
	return value + timings.slide7;
}

export default function(timeline) {
	var root = timeline.elem;
	var elem = root.querySelector('.qt-slide7');
	
	timeline.add(time(0), new KeyframeClip(root.querySelector('.livestyle-popup'), {
		0:   {scale: 1},
		100: {scale: 0}
	}));

	timeline.add(time(0), new ToggleClassClip('.browser__devtools', 'hidden'));
	timeline.add(time(0), new KeyframeClip('.browser', {
		0:    {x: -365, y: 700, rotate: -45, transition: 'inOutCubic'},
		1500: {x: 225, y: 250, rotate: 0}
	}));

	timeline.add(time(0), new KeyframeClip('.editor', {
		0:    {x: 225, y: 250, rotate: 0, transition: 'inOutCubic'},
		1500: {x: 900, y: 700, rotate: 45}
	}));

	timeline.add(time(500), new TextRevealClip('#qt-slide7-tx1', 1000));
	timeline.add(time(3000), new TextInputClip('.browser__url', 'www.my-live-web-site.com', {
		beforeDelay: 1500,
		afterDelay: 2000,
		duration: 1300
	}));

	timeline.add(time(8000), new TextRevealClip('#qt-slide7-tx2', 1000));

	timeline.add(time(11000), fade(elem));
	timeline.add(time(11000), new KeyframeClip('.browser', {
		0:    {x: 225, y: 250, rotate: 0, transition: 'inOutCubic'},
		1500: {x: -365, y: 700, rotate: -45}
	}));
};