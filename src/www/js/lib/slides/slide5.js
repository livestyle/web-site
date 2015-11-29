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
	var $ = sel => root.querySelector(sel);
	var elem = $('.qt-slide5');
	var spark = $('.qt-spark');
	var editorLine = $('.editor .code-line:nth-of-type(5)');
	var browserLine = $('.browser .code-line:nth-of-type(6)');
	var editorToken = $('.editor .code-line:nth-of-type(4) .code-token_3');
	var browserToken = $('.browser .code-line:nth-of-type(4) .code-token-wrap');

	var path1 =   [[710, 433], [710, 251], [628, 145], [486, 145]];
	var path2 =   [[270, 128], [180, 128], [155, 322], [300, 360]];
	var path2_2 = [[270, 128], [180, 128], [155, 347], [300, 385]];

	editorLine.classList.add('hidden');
	browserLine.classList.add('hidden');
	
	timeline.add(time(0), new TextRevealClip('#qt-slide5-tx1', 4000));
	timeline.add(time(5500), new HighlightClip(editorToken));
	timeline.add(time(6000), new TextInputClip(editorToken.querySelector('.code-token-wrap'), '20px', {
		beforeDelay: 700,
		afterDelay: 200,
		duration: 500
	}));
	timeline.add(time(7500), new FollowPathClip(spark, path1, 2000));
	timeline.add(time(10000), new FollowPathClip(spark, path2, 1500));

	var kf1 = 11500;
	timeline.add(time(kf1), new ToggleClassClip(browserLine, 'hidden', true));
	timeline.add(time(kf1), new HighlightClip(browserLine.querySelector('.code-line-content')));
	timeline.add(time(kf1), new StateClip('.browser__content', {
		0:    '',
		500:  'edit3',
		3300: 'edit4'
	}));

	timeline.add(time(13000), new TextInputClip(browserToken, 'darkblue', {
		beforeDelay: 700,
		afterDelay: 200,
		duration: 900
	}));
	timeline.add(time(15500), new FollowPathClip(spark, path2_2, {
		duration: 1800,
		reverse: true
	}));
	timeline.add(time(18000), new FollowPathClip(spark, path1, {
		duration: 2000,
		reverse: true
	}));

	var kf2 = 20000;
	timeline.add(time(kf2), new ToggleClassClip(editorLine, 'hidden', true));
	timeline.add(time(kf2), new HighlightClip(editorLine.querySelector('.code-line-content')));
	
	timeline.add(time(22500), fade(elem));
};