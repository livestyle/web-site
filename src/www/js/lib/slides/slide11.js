'use strict';

import timings from './timings';
import TextRevealClip from '../clip/text-reveal';
import fade from '../effects/fade';

function time(value) {
	return value + timings.slide11;
}

export default function(timeline) {
	timeline.add(time(0), new TextRevealClip('.qt-play-again', 500));
};