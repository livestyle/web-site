/**
 * A slide for “Bi-directional” part of main page
 */
'use strict';

import TextInputClip   from '../clip/text-input';
import HighlightClip   from '../clip/highlight';
import FollowPathClip  from '../clip/follow-path';
import ToggleClassClip from '../clip/toggle-class';
import KeyframeClip    from '../clip/keyframe';

export default function(timeline) {
	var $ = sel => timeline.elem.querySelector(sel);
	var time = v => v;  // for easier tweaking and debugging

	var spark = $('.spark');
	var lsPopup = $('.livestyle-popup');
	var lsPopupToggler = $('.livestyle-popup__toggler');
	var lsPopupFiles = $('.livestyle-popup__files');
	var editorToken = $('.editor .code-line:nth-of-type(3) .code-token_4');
	var browserToken = $('.browser .code-line:nth-of-type(3) .code-token_4');

	var path1 = [[613, 113], [562, 81], [479, 91], [439, 143]];
	var path2 = [[213, 121], [83, 121], [104, 470], [240, 470]];

	// initial setup
	spark.style.visibility = 'visible';
	lsPopupToggler.classList.add('livestyle-popup__toggler_disabled');

	// setup animations
	timeline.add(time(0), new KeyframeClip(lsPopup, {
		0:   {scale: 0, transition: 'outBack'},
		500: {scale: 1}
	}));

	timeline.add(time(1300), new ToggleClassClip(lsPopupToggler, 'livestyle-popup__toggler_disabled', true));
	timeline.add(time(1700), new KeyframeClip(lsPopupFiles, {
		0:   {opacity: 0},
		300: {opacity: 1}
	}));

	timeline.add(time(2000), new HighlightClip(editorToken));
	timeline.add(time(2500), new TextInputClip(editorToken.querySelector('.code-token-wrap'), 'blue', {
		beforeDelay: 700,
		afterDelay: 200,
		duration: 600,
		activeClass: 'code-caret'
	}));

	timeline.add(time(5000), new FollowPathClip(spark, path1, {duration: 500}));

};