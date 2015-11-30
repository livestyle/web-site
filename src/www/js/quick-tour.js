'use strict';

import Timeline from './lib/timeline';
import animations from './lib/animations';
import playbackControls from './lib/playback-controls';
import {toArray} from './lib/utils';

var timeline = animations(new Timeline('.qt-screen'));
timeline.elem.classList.remove('qt-invisible');
playbackControls('.playback-controls', timeline);

var startTime = location.hash.replace('#', '');
if (!startTime) {
	startTime = 0;
}

timeline.timecode = startTime;
setTimeout(() => timeline.play(), 1000);
document.addEventListener('click', evt => timeline.toggle());