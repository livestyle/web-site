'use strict';

import Timeline from './lib/timeline';
import debugControls from './lib/debug-controls';
import slide1 from './lib/main-page-slides/bidirectional';
import slide2 from './lib/main-page-slides/one-heart';

setupSlide('.layout-content_bidirectional .layout-assets', slide1);
setupSlide('.layout-content_one-heart .layout-assets', slide2);

///////////////////////////

function setupSlide(sel, slideFactory) {
	var tm = new Timeline(sel);
	slideFactory(tm);
	tm.timecode = 0;

	var dbgElem = tm.elem.querySelector('.debug-controls');
	if (dbgElem) {
		debugControls(dbgElem, tm);
	}
}