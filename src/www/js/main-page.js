'use strict';

import Timeline from './lib/timeline';
import debugControls from './lib/debug-controls';
import slide1 from './lib/main-page-slides/bidirectional';
import slide2 from './lib/main-page-slides/one-heart';
import slide3 from './lib/main-page-slides/remote-view';
import ViewportPlaybackTrigger from './lib/viewport-playback-trigger';
import qtPopup from './lib/quick-tour-popup';
import {toArray} from './lib/utils';

setupSlide('.layout-content_bidirectional .layout-assets', slide1);
setupSlide('.layout-content_one-heart .layout-assets', slide2);
setupSlide('.layout-content_remote-view', slide3);

var popup = qtPopup('.quick-tour-popup');
var isOSX = navigator.platform.indexOf('Mac') !== -1;

document.querySelector('.hero-link_demo').addEventListener('click', function(evt) {
	evt.preventDefault();
	evt.stopPropagation();
	popup.show(this.href);
});

document.addEventListener('keyup', evt => {
	if (evt.keyCode === 27) { // esc key
		popup.hide();
	}
});

// setup download button
getLatestRelease(release => {
	var assets = release.assets.reduce((result, asset) => {
		result[asset.name] = asset;
		return result;
	}, {});
	var fileName = isOSX ? 'livestyle-osx.zip' : 'LiveStyleSetup.exe';
	if (assets[fileName]) {
		toArray(document.querySelectorAll('.download-btn'))
		.forEach(elem => elem.href = assets[fileName].browser_download_url);
	}
});

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

function getLatestRelease(callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://api.github.com/repos/livestyle/app/releases/latest');
	xhr.onreadystatechange = function() {
		if (this.readyState !== 4 || this.status === 0) {
			return;
		}

		if (this.status === 200) {
			try {
				return callback(JSON.parse(this.responseText));
			} catch(err) {
				console.error(err);
			}
		}

		console.error(this.responseText);
	};
	xhr.send();
}