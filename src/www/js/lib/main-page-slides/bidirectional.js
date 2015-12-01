/**
 * A slide for “Bi-directional” part of main page
 */
'use strict';

import TextInputClip   from '../clip/text-input';
import HighlightClip   from '../clip/highlight';
import FollowPathClip  from '../clip/follow-path';
import ToggleClassClip from '../clip/toggle-class';
import KeyframeClip    from '../clip/keyframe';
import {toArray}       from '../utils';

export default function(timeline) {
	var $ = (sel, ctx=timeline.elem) => ctx.querySelector(sel);
	var time = v => v;  // for easier tweaking and debugging

	var spark = $('.spark');
	var lsPopup = $('.livestyle-popup');
	var lsPopupToggler = $('.livestyle-popup__toggler');
	var lsPopupFiles = $('.livestyle-popup__files');
	var sampleContent = $('.browser .sample-content');
	var editorLine = $('.editor .code-line:nth-of-type(3)');
	var editorToken = $('.code-token_4', editorLine);
	var editorTokenColors = toArray(editorToken.querySelectorAll('.code-token-wrap'));
	var browserToken = $('.browser .code-line:nth-of-type(3) .code-token_4');
	var browserTokenColors = toArray(browserToken.querySelectorAll('.code-token-wrap'));

	var path1 = [[613, 113], [562, 81], [479, 91], [439, 143]];
	var path2 = [[213, 121], [83, 121], [104, 470], [240, 470]];

	// initial setup
	spark.style.visibility = 'visible';
	editorLine.classList.add('code-line_up');
	lsPopupToggler.classList.add('livestyle-popup__toggler_disabled');

	// setup animations
	timeline.add(time(0), new KeyframeClip(lsPopup, {
		0:   {scale: 0, transition: 'outBack'},
		500: {scale: 1}
	}));

	timeline.add(time(1000), new ToggleClassClip(lsPopupToggler, 'livestyle-popup__toggler_disabled', true));
	timeline.add(time(1500), new KeyframeClip(lsPopupFiles, {
		0:   {opacity: 0},
		300: {opacity: 1}
	}));

	timeline.add(time(2800), new HighlightClip(editorToken));
	timeline.add(time(3300), new TextInputClip(editorTokenColors[0], 'blue', {
		beforeDelay: 700,
		afterDelay: 200,
		duration: 600,
		activeClass: 'code-caret'
	}));

	timeline.add(time(5000), new FollowPathClip(spark, path1, {duration: 650}));
	timeline.add(time(5800), new FollowPathClip(spark, path2, {duration: 1000}));
	
	var kf1 = 6800;
	timeline.add(time(kf1), new ToggleClassClip(browserTokenColors[0], 'hidden'));
	timeline.add(time(kf1), new ToggleClassClip(browserTokenColors[1], 'hidden', true));
	timeline.add(time(kf1), new HighlightClip(browserToken));

	timeline.add(time(7300), new ToggleClassClip(sampleContent, 'sample-content_edit1'));

	timeline.add(time(9000), new TextInputClip(browserTokenColors[1], 'red', {
		beforeDelay: 700,
		afterDelay: 200,
		duration: 500,
		activeClass: 'code-caret'
	}));

	timeline.add(time(10500), new ToggleClassClip(sampleContent, 'sample-content_edit2'));
	timeline.add(time(11000), new FollowPathClip(spark, path2, {duration: 1000, reverse: true}));
	timeline.add(time(12300), new FollowPathClip(spark, path1, {duration: 600,  reverse: true}));

	var kf2 = 12900;
	timeline.add(time(kf2), new HighlightClip(editorToken));
	timeline.add(time(kf2), new ToggleClassClip(editorTokenColors[0], 'hidden'));
	timeline.add(time(kf2), new ToggleClassClip(editorTokenColors[1], 'hidden', true));

};