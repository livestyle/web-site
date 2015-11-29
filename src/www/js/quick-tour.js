'use strict';

import Timeline from './lib/timeline';
import animations from './lib/animations';
import debugControls from './lib/debug-controls';
import {toArray} from './lib/utils';


var timeline = animations(new Timeline('.qt-screen'));
timeline.elem.classList.remove('qt-invisible');
setupDebugControls(timeline);

function setupDebugControls(timeline) {
	var dbgElem = document.querySelector('.debug-controls');
	if (dbgElem) {
		debugControls(dbgElem, timeline);
	}
}