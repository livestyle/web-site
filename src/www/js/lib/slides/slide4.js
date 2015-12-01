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
	return value + timings.slide4;
}

export default function(timeline) {
	var root = timeline.elem;
	var elem = root.querySelector('.qt-slide4');
	var $ = sel => root.querySelector(sel);
	var text1 = '#qt-slide4-tx1';
	var text2 = '#qt-slide4-tx2';
	var text3 = '#qt-slide4-tx3';
	var spark = root.querySelector('.qt-spark');
	
	var editorToken = $('.editor .code-line:nth-of-type(3) .code-token_4');
	var browserToken = $('.browser .code-line:nth-of-type(3) .code-token_4');
	var editorTokenValue1 = editorToken.querySelector('.code-token-wrap:nth-of-type(1)');
	var editorTokenValue2 = editorToken.querySelector('.code-token-wrap:nth-of-type(2)');
	var browserTokenValue1 = browserToken.querySelector('.code-token-wrap:nth-of-type(1)');
	var browserTokenValue2 = browserToken.querySelector('.code-token-wrap:nth-of-type(2)');

	timeline.add(time(0), new TextRevealClip(text1, 2000));
	timeline.add(time(2500), new HighlightClip(editorToken, 500));
	timeline.add(time(3000), new TextInputClip(editorTokenValue1, 'red', {
		beforeDelay: 700,
		afterDelay: 200,
		duration: 600
	}));

	var path1 = [[694, 403], [694, 251], [628, 145], [486, 145]];
	var path2 = [[270, 128], [180, 128], [155, 322], [300, 360]];
	timeline.add(time(5000), new TextRevealClip(text2, 1500));
	timeline.add(time(5000), new FollowPathClip(spark, path1, 900));
	timeline.add(time(6100), new FollowPathClip(spark, path2, 800));
	
	var kf1 = 6900;
	timeline.add(time(kf1), new ToggleClassClip(browserTokenValue1, 'hidden'));
	timeline.add(time(kf1), new ToggleClassClip(browserTokenValue2, 'hidden', true));
	timeline.add(time(kf1), new HighlightClip(browserToken));
	timeline.add(time(kf1), new StateClip('.browser__content', {
		0: '',
		500: 'edit1',
		6000: 'edit2'
	}));


	timeline.add(time(9000), new TextRevealClip(text3, 700));
	timeline.add(time(11000), new HighlightClip(browserToken));

	timeline.add(time(11500), new TextInputClip(browserTokenValue2, 'blue', {
		beforeDelay: 700,
		afterDelay: 200,
		duration: 600
	}));

	timeline.add(time(13500), new FollowPathClip(spark, path2, {
		duration: 800,
		reverse: true
	}));
	timeline.add(time(14400), new FollowPathClip(spark, path1, {
		duration: 900,
		reverse: true
	}));

	var kf2 = 15300;
	timeline.add(time(kf2), new ToggleClassClip(editorTokenValue1, 'hidden'));
	timeline.add(time(kf2), new ToggleClassClip(editorTokenValue2, 'hidden', true));
	timeline.add(time(kf2), new HighlightClip(editorToken));

	timeline.add(time(18000), fade(elem));
}