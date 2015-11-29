'use strict';

import timings from './timings';
import KeyframeClip from '../clip/keyframe';
import TextRevealClip from '../clip/text-reveal';
import fade from '../effects/fade';

function time(value) {
	return value + timings.slide6;
}

export default function(timeline) {
	var root = timeline.elem;
	var elem = root.querySelector('.qt-slide6');
	
	timeline.add(time(0), new KeyframeClip('.browser', {
		0:    {x: 10, y: 10, rotate: 0, transition: 'inOutCubic'},
		2000: {x: -365, y: 700, rotate: -45}
	}));

	timeline.add(time(200), new KeyframeClip('.editor', {
		0:    {x: 580, y: 300, transition: 'inOutCubic'},
		1500: {x: 225, y: 250}
	}));

	timeline.add(time(700), new TextRevealClip('#qt-slide6-tx1', 1000));
	timeline.add(time(4500), new TextRevealClip('#qt-slide6-tx2', 2000));

	var t2 = 5000;
	var tabAnim1 = sel => {
		timeline.add(time(t2), new KeyframeClip(sel, {
			0:   {y: 35, transition: 'outExpo'},
			600: {y: 0}
		}));
		t2 += 250;
	};

	tabAnim1('.editor__tab[data-source=usb]');
	tabAnim1('.editor__tab[data-source=ftp]');
	tabAnim1('.editor__tab[data-source=smb]');
	tabAnim1('.editor__tab[data-source=untitled]');

	var t3 = 11000;
	var tabAnim2 = sel => {
		timeline.add(time(t3), new KeyframeClip(sel, {
			0:   {y: 0, transition: 'outExpo'},
			600: {y: 35}
		}));
		t3 += 100;
	};

	timeline.add(time(t3), fade(elem));
	tabAnim2('.editor__tab[data-source=untitled]');
	tabAnim2('.editor__tab[data-source=smb]');
	tabAnim2('.editor__tab[data-source=ftp]');
	tabAnim2('.editor__tab[data-source=usb]');
};