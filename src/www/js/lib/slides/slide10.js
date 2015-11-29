'use strict';

import timings from './timings';
import KeyframeClip from '../clip/keyframe';
import TextRevealClip from '../clip/text-reveal';
import TextInputClip from '../clip/text-input';
import ToggleClassClip from '../clip/toggle-class';
import HighlightClip from '../clip/highlight';
import fade from '../effects/fade';
import {toArray} from '../utils';

function time(value) {
	return value + timings.slide10;
}

export default function(timeline) {
	var root = timeline.elem;
	var $ = sel => root.querySelector(sel);
	var elem = $('.qt-slide10');
	var devices = toArray(root.querySelectorAll('.device'));
	var editorToken = $('.editor .code-line:nth-of-type(5) .code-token_4');
	var editorTokenValue1 = editorToken.querySelector('.code-token-wrap:nth-of-type(1)');
	var editorTokenValue2 = editorToken.querySelector('.code-token-wrap:nth-of-type(2)');

	timeline.add(time(0), new ToggleClassClip(editorTokenValue1, 'hidden'));
	timeline.add(time(0), new ToggleClassClip(editorTokenValue2, 'hidden', true));
	timeline.add(time(0), new TextRevealClip('#qt-slide10-tx1', 1500));
	timeline.add(time(0), new KeyframeClip('.editor', {
		0:    {x: 900, y: 700, rotate: 45, opacity: 0, transition: 'inOutCubic'},
		1500: {x: 542, y: 295, rotate: 0, opacity: 1}
	}));

	timeline.add(time(2500), new HighlightClip(editorToken), 800);

	timeline.add(time(3100), new TextInputClip(editorTokenValue2, 'green', {
		beforeDelay: 1800,
		afterDelay: 200,
		duration: 600
	}));

	var kf1 = 6500;
	timeline.add(time(kf1), new ToggleClassClip(`.browser__content`, 'browser__content_rv-edited'));
	devices.forEach(device => {
		timeline.add(time(kf1), new ToggleClassClip(device, 'device_edited'));
	});

	var kf2 = 9000;
	timeline.add(time(kf2), fade(elem));
	timeline.add(time(kf2), new KeyframeClip('.editor', {
		0:    {x: 542, y: 270, rotate: 0, opacity: 1, transition: 'inOutCubic'},
		1500: {x: 900, y: 700, rotate: 45, opacity: 0}
	}));
	timeline.add(time(kf2), new KeyframeClip('.browser', {
		0:    {x: 10, y: 270, rotate: 0, opacity: 1, transition: 'inOutCubic'},
		1500: {x: -365, y: 700, rotate: -45, opacity: 0}
	}));
	devices.forEach((device, i) => {
		timeline.add(time(kf2 + i * 150), new KeyframeClip(device, {
			0:   {y: 0, opacity: 1, transition: 'inExpo'},
			800: {y: -220, opacity: 0}
		}));
	});
};