'use strict';

import {toggleClass} from './utils';

export default function(elem, timeline) {
	if (typeof elem === 'string') {
		elem = document.querySelector(elem);
	}

	var startTime = location.hash.replace('#', '');
	if (!startTime) {
		startTime = 0;
	}

	var togglePlayback = () => {
		if (timeline.state === 'play') {
			timeline.pause();
		} else {
			if (timeline.timecode === timeline.duration) {
				timeline.timecode = startTime;
			}
			timeline.play();
		}
	};

	var playbackBtn = elem.querySelector('button[name="playback"]');
	var progress = elem.querySelector('input[name="progress"]');
	var timecode = elem.querySelector('input[name="timecode"]');

	timeline
	.on('state', state => toggleClass(playbackBtn, 'playing', state === 'play'))
	.on('render', time => {
		progress.value = timecode.value = time | 0;
	})
	.on('update', () => progress.max = timeline.duration);

	playbackBtn.addEventListener('click', togglePlayback);
	document.addEventListener('keydown', evt => {
		if (evt.keyCode === 32) {
			togglePlayback();
			evt.preventDefault();
			evt.stopPropagation();
		}
	});
	progress.addEventListener('input', function(evt) {
		if (timeline.state === 'pause') {
			timeline.timecode = +this.value;
		}
	});

	progress.max = timeline.duration;
	timeline.timecode = +startTime;
};

function debugRects(elem) {
	var rects = [];
	var root = elem.offsetParent;
	var rootRect = root.getBoundingClientRect();
	var innerElems = [];
	if (innerElems.length) {
		for (var i = 0, il = innerElems.length; i < il; i++) {
			rects = rects.concat(toArray(innerElems[i].getClientRects()));
		}
	} else {
		rects = rects.concat(toArray(elem.getClientRects()));
	}

	console.log('root rect', rootRect);
	console.log('rects', rects);

	rects.forEach(rect => {
		var r = document.createElement('span');
		r.className = 'debug-rect';
		r.style.cssText = `;
			left:${rect.left - rootRect.left}px;
			top:${rect.top - rootRect.top}px;
			width:${rect.right - rect.left}px;
			height:${rect.bottom - rect.top}px;`;
		root.appendChild(r);
	});
}

function toArray(obj) {
	return Array.prototype.slice.call(obj, 0);
}