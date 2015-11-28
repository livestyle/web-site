/**
 * A slide for “Remote View” part of main page
 */

import TextInputClip   from '../clip/text-input';
import HighlightClip   from '../clip/highlight';
import ToggleClassClip from '../clip/toggle-class';
import KeyframeClip    from '../clip/keyframe';
import {toArray}       from '../utils';

export default function(timeline) {
	var $ = sel => timeline.elem.querySelector(sel);
	var time = v => v;  // for easier tweaking and debugging
	var devices = toArray(timeline.elem.querySelectorAll('.device'));
	var editorToken = $('.editor .code-line:nth-of-type(5) .code-token_4');
	var browserContent = $('.browser__content');

	timeline.add(time(0), new KeyframeClip($('.livestyle-popup'), {
		0:   {scale: 0, transition: 'outBack'},
		500: {scale: 1}
	}));

	timeline.add(time(1000), new ToggleClassClip($('.livestyle-popup__toggler'), 'livestyle-popup__toggler_disabled', true));
	timeline.add(time(1500), new KeyframeClip($('.livestyle-popup__title'), {
		0:   {y: 0, transition: 'outExpo'},
		400: {y: -36}
	}));

	devices.forEach((device, i) => {
		timeline.add(time(2200 + i * 150), new KeyframeClip(device, {
			0:   {y: 250, opacity: 0, transition: 'outExpo'},
			700: {y: 0, opacity: 1}
		}));
	});

	timeline.add(time(3500), new HighlightClip(editorToken));

	timeline.add(time(4100), new TextInputClip(editorToken.querySelector('.code-token-wrap'), 'green', {
		beforeDelay: 1800,
		afterDelay: 200,
		duration: 600,
		activeClass: 'code-caret'
	}));

	var kf1 = 7300;
	console.log('add kf at', kf1);
	timeline.add(time(kf1), new ToggleClassClip(browserContent, 'browser__content_edited'));
	devices.forEach(device => {
		timeline.add(time(kf1), new ToggleClassClip(device, 'device_edited'));
	});
};