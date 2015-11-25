'use strict';

import timings from './timings';
import TextRevealClip from '../clip/text-reveal';
import TextInputClip from '../clip/text-input';
import HighlightClip from '../clip/highlight';
import FollowPathClip from '../clip/follow-path';
import ToggleClassClip from '../clip/toggle-class';
import StateClip from '../clip/state';
import fade from '../effects/fade';

function time(value) {
	return value + timings.slide5;
}

export default function(timeline) {
	var root = timeline.elem;
	var elem = root.querySelector('.qt-slide5');
	var path1 = [[710, 433], [710, 251], [628, 145], [486, 145]];
	var path2 = [[283, 125], [186, 125], [180, 375], [295, 375]];
	var path2_2 = [[283, 125], [186, 125], [180, 350], [295, 350]];
	
	timeline.add(time(0), new TextRevealClip('#qt-slide5-tx1', 4000));
	timeline.add(time(5500), new HighlightClip('#qt-editor-token2'));
	timeline.add(time(6000), new TextInputClip('#qt-editor-token2code', '20px', {
		beforeDelay: 700,
		afterDelay: 200,
		duration: 500
	}));
	timeline.add(time(7500), new FollowPathClip('.qt-ball', path1, 2000));
	timeline.add(time(10000), new FollowPathClip('.qt-ball', path2, 1500));

	var kf1 = 11500;
	timeline.add(time(kf1), new ToggleClassClip('#qt-browser-line1', 'qt-hidden', true));
	timeline.add(time(kf1), new HighlightClip('#qt-browser-prop1'));
	timeline.add(time(kf1), new StateClip('.qt-browser__content', {
		0:    '',
		500:  'edit3',
		3300: 'edit4'
	}));

	timeline.add(time(13000), new TextInputClip('#qt-browser-token2', 'darkblue', {
		beforeDelay: 700,
		afterDelay: 200,
		duration: 900
	}));
	timeline.add(time(15500), new FollowPathClip('.qt-ball', path2_2, {
		duration: 1800,
		reverse: true
	}));
	timeline.add(time(18000), new FollowPathClip('.qt-ball', path1, {
		duration: 2000,
		reverse: true
	}));

	var kf2 = 20000;
	timeline.add(time(kf2), new ToggleClassClip('#qt-editor-line1', 'qt-hidden', true));
	timeline.add(time(kf2), new HighlightClip('#qt-editor-prop1'));
	
	timeline.add(time(22500), fade(elem));
};