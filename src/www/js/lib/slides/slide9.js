'use strict';

import timings from './timings';
import KeyframeClip from '../clip/keyframe';
import TextRevealClip from '../clip/text-reveal';
import TextInputClip from '../clip/text-input';
import ToggleClassClip from '../clip/toggle-class';
import StateClip from '../clip/state';
import fade from '../effects/fade';
import {toArray} from '../utils';

function time(value) {
	return value + timings.slide9;
}

export default function(timeline) {
	var root = timeline.elem;
	var elem = root.querySelector('.qt-slide9');
	var devices = toArray(root.querySelectorAll('.device'));
	var browserUrl = root.querySelector('.browser__url');
	var browserUrl2 = browserUrl.cloneNode(true);
	browserUrl2.classList.add('hidden');
	browserUrl.parentNode.appendChild(browserUrl2);
	
	timeline.add(time(0), new StateClip('.browser__content', {
		0: '',
		1: 'original'
	}));
	timeline.add(time(50), new KeyframeClip('.browser', {
		0:    {x: -365, y: 700, rotate: -45, opacity: 0, transition: 'inOutCubic'},
		2000: {x: 10, y: 295, rotate: 0, opacity: 1}
	}));

	timeline.add(time(0), new ToggleClassClip('.livestyle-popup__main', 'hidden'));
	timeline.add(time(0), new ToggleClassClip('.livestyle-popup__rv', 'hidden', true));
	timeline.add(time(0), new ToggleClassClip(browserUrl, 'hidden'));
	timeline.add(time(0), new ToggleClassClip(browserUrl2, 'hidden', true));

	timeline.add(time(2100), new KeyframeClip(root.querySelector('.livestyle-popup'), {
		0:   {scale: 0, transition: 'outBack'},
		700: {scale: 1}
	}));

	timeline.add(time(1000), new TextRevealClip('#qt-slide9-tx1', 1500));

	timeline.add(time(4500), new ToggleClassClip('.livestyle-popup__rv .livestyle-popup__toggler', 'livestyle-popup__toggler_disabled', true));
	timeline.add(time(5000), new KeyframeClip('.livestyle-popup__rv .livestyle-popup__title', {
		0:   {y: 0, transition: 'outExpo'},
		400: {y: -36}
	}));


	var t2 = 7500;
	timeline.add(time(t2), new TextRevealClip('#qt-slide9-tx2', 1500));
	devices.forEach((device, i) => {
		timeline.add(time(t2 + i * 150), new KeyframeClip(device, {
			0:   {y: -220, opacity: 0, transition: 'outExpo'},
			1000: {y: 0, opacity: 1}
		}));
	});

	timeline.add(time(12000), fade(elem));
};