/**
 * A slide for One Heart” part of main page
 */
'use strict';

import KeyframeClip from '../clip/keyframe';
import {toArray}    from '../utils';

export default function(timeline) {
	var tabs = toArray(timeline.elem.querySelectorAll('.editor__tab')).slice(1);

	tabs.forEach((tab, i) => {
		timeline.add(200 * i, new KeyframeClip(tab, {
			0:   {y: 35, transition: 'outExpo'},
			600: {y: 0}
		}));
	});
};