'use strict';

import timings from './timings';
import KeyframeClip from '../clip/keyframe';
import TextRevealClip from '../clip/text-reveal';
import TextInputClip from '../clip/text-input';
import ToggleClassClip from '../clip/toggle-class';
import StateClip from '../clip/state';
import fade from '../effects/fade';

function time(value) {
	return value + timings.slide9;
}

export default function(timeline) {
	var root = timeline.elem;
	var elem = root.querySelector('.qt-slide9');
	
	timeline.add(time(0), new StateClip('.qt-browser__content', {
		0: '',
		1: 'original'
	}));
	timeline.add(time(50), new KeyframeClip('.qt-browser', {
		0:    {x: -365, y: 700, rotate: -45, transition: 'inOutCubic'},
		2000: {x: 10, y: 270, rotate: 0}
	}));

	timeline.add(time(0), new ToggleClassClip('.qt-livestyle__main', 'qt-hidden'));
	timeline.add(time(0), new ToggleClassClip('.qt-livestyle__rv', 'qt-hidden', true));
	timeline.add(time(0), new ToggleClassClip('.qt-browser__devtools', 'qt-hidden'));
	timeline.add(time(0), new ToggleClassClip('#qt-browser-address-bar-tx1', 'qt-hidden'));
	timeline.add(time(0), new ToggleClassClip('#qt-browser-address-bar-tx2', 'qt-hidden', true));

	timeline.add(time(2100), new KeyframeClip(root.querySelector('.qt-livestyle'), {
		0:   {scale: 0, transition: 'outBack'},
		700: {scale: 1}
	}));

	timeline.add(time(1000), new TextRevealClip('#qt-slide9-tx1', 1500));

	timeline.add(time(4500), new ToggleClassClip('.qt-livestyle__rv .qt-livestyle__toggler', 'qt-livestyle__toggler_disabled', true));
	timeline.add(time(5000), new KeyframeClip('.qt-livestyle__rv .qt-livestyle__title', {
		0:   {y: 0, transition: 'outExpo'},
		400: {y: -36}
	}));


	var t2 = 7500;
	timeline.add(time(t2), new TextRevealClip('#qt-slide9-tx2', 1500));
	var devAnim1 = sel => {
		timeline.add(time(t2), new KeyframeClip(sel, {
			0:   {y: -180, transition: 'outExpo'},
			1000: {y: 0}
		}));
		t2 += 150;
	};

	devAnim1('.qt-dev-phone');
	devAnim1('.qt-dev-tablet');
	devAnim1('.qt-dev-browser');
	devAnim1('.qt-dev-vm');

	timeline.add(time(12000), fade(elem));
};