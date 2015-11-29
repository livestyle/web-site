'use strict';

import timings  from './slides/timings';
import slide1   from './slides/slide1';
import slide2   from './slides/slide2';
import slide3   from './slides/slide3';
import slide4   from './slides/slide4';
import slide5   from './slides/slide5';
import slide6   from './slides/slide6';
import slide7   from './slides/slide7';
import slide8   from './slides/slide8';
import slide9   from './slides/slide9';
import slide10  from './slides/slide10';
import slide11  from './slides/slide11';

import SlideToggleClip from './clip/slide-toggle';

export default function(timeline) {
	var keyframes = Object.keys(timings).reduce((obj, id) => {
		obj[timings[id]] = 'qt-' + id;
		return obj;
	}, {});

	timeline.add(new SlideToggleClip(timeline.elem.querySelectorAll('.qt-slide'), keyframes));

	slide1(timeline);
	slide2(timeline);
	slide3(timeline);
	slide4(timeline);
	slide5(timeline);
	slide6(timeline);
	slide7(timeline);
	slide8(timeline);
	slide9(timeline);
	slide10(timeline);
	slide11(timeline);

	timeline.timecode = 0;
	return timeline;
};