'use strict';

import Timeline from './lib/timeline';
import debugControls from './lib/debug-controls';
import slide1 from './lib/main-page-slides/bidirectional';
import slide2 from './lib/main-page-slides/one-heart';
import slide3 from './lib/main-page-slides/remote-view';
import ViewportPlaybackTrigger from './lib/viewport-playback-trigger';

setupSlide('.layout-content_bidirectional .layout-assets', slide1);
setupSlide('.layout-content_one-heart .layout-assets', slide2);
setupSlide('.layout-content_remote-view', slide3);

///////////////////////////

function setupSlide(sel, factory, a) {
	var tm = new Timeline(sel);
	factory(tm);
	tm.timecode = 0;

	slidePlaybackController(tm);
	setupDebugControls(tm);
}

/**
 * Setups slide (timeline) playback: play when slide is visible to user and 
 * rewind when off-screen
 * @param  {Timeline} timeline
 */
function slidePlaybackController(timeline) {
	var controller = new ViewportPlaybackTrigger(timeline);
	var check = () => controller.check(getViewport());
	window.addEventListener('scroll', check);
	window.addEventListener('resize', evt => {
		controller.resetRect();
		check();
	});
	check();
}

function setupDebugControls(timeline) {
	var dbgElem = timeline.elem.querySelector('.debug-controls');
	if (dbgElem) {
		debugControls(dbgElem, timeline);
	}
}

/**
 * Returns browser window viewport: a rect describing visible area of page
 * @return {Object}
 */
function getViewport() {
	return {
		top: window.pageYOffset,
		bottom: window.pageYOffset + window.innerHeight,
		left: window.pageXOffset,
		right: window.pageXOffset + window.innerWidth
	};
}