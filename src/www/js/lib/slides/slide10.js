'use strict';

import timings from './timings';
import KeyframeClip from '../clip/keyframe';
import TextRevealClip from '../clip/text-reveal';
import TextInputClip from '../clip/text-input';
import ToggleClassClip from '../clip/toggle-class';
import HighlightClip from '../clip/highlight';
import fade from '../effects/fade';

function time(value) {
	return value + timings.slide10;
}

export default function(timeline) {
	var root = timeline.elem;
	var elem = root.querySelector('.qt-slide10');
	var devices = ['phone', 'tablet', 'browser', 'vm'];
	
	timeline.add(time(0), new ToggleClassClip('#qt-editor-line1', 'qt-hidden'));
	timeline.add(time(0), new ToggleClassClip('#qt-editor-line2', 'qt-hidden', true));
	timeline.add(time(0), new TextRevealClip('#qt-slide10-tx1', 1500));
	timeline.add(time(0), new KeyframeClip('.qt-editor', {
		0:    {x: 900, y: 700, rotate: 45, transition: 'inOutCubic'},
		1500: {x: 542, y: 270, rotate: 0}
	}));

	timeline.add(time(2500), new HighlightClip('#qt-editor-token3'), 800);

	timeline.add(time(3100), new TextInputClip('#qt-editor-token3code', 'red', {
		beforeDelay: 1800,
		afterDelay: 200,
		duration: 600
	}));

	var kf1 = 6500;
	timeline.add(time(kf1), new ToggleClassClip(`.qt-browser__content`, 'qt-browser__content_rv-edited'));
	devices.forEach(name => {
		timeline.add(time(kf1), new ToggleClassClip(`.qt-dev-${name} .qt-dev-sample`, 'qt-dev-sample_rv-edited'));
	});

	var kf2 = 9000;
	var devAnim1 = name => {
		timeline.add(time(kf2), new KeyframeClip(`.qt-dev-${name}`, {
			0:   {y: 0, transition: 'inExpo'},
			800: {y: -180}
		}));
		kf2 += 150;
	};

	timeline.add(time(kf2), fade(elem));
	timeline.add(time(kf2), new KeyframeClip('.qt-editor', {
		0:    {x: 542, y: 270, rotate: 0, transition: 'inOutCubic'},
		1500: {x: 900, y: 700, rotate: 45}
	}));
	timeline.add(time(kf2), new KeyframeClip('.qt-browser', {
		0:    {x: 10, y: 270, rotate: 0, transition: 'inOutCubic'},
		1500: {x: -365, y: 700, rotate: -45}
	}));
	devices.forEach(devAnim1);
};