/**
 * A Quick Tour playback controls UI
 */
'use strict';

import * as pointer from './pointer-events';
import {toggleClass} from './utils';

export default function(container, timeline) {
	if (typeof container === 'string') {
		container = document.querySelector(container);
	}

	if (!container) {
		throw new Error('Container is empty');
	}

	return new Controls(container, timeline);
}

class Controls {
	constructor(container, timeline) {
		this.timeline = timeline;
		this.container = container;
		this.playBtn = container.querySelector('.playback-controls__play');
		this.progressShaft = container.querySelector('.playback-controls__progress');
		this.progress = container.querySelector('.playback-controls__progress-fill');

		this.moveThreshold = 3;
		this.scrobbling = false;

		var renderTime = time => this.progress.style.width = (100 * time / timeline.duration) + '%';

		timeline
		.on('state', state => {
			toggleClass(container, 'playback-controls_paused', state !== 'play');
			if (state === 'play') {
				this.autohide();
			} else {
				this.show();
			}
		})
		.on('render', renderTime);

		renderTime(timeline.timecode);
		this.playBtn.addEventListener('click', evt => {
			evt.stopPropagation();
			evt.preventDefault();
			this.togglePlayback();
		});

		this.progressShaft.addEventListener('click', evt => evt.stopPropagation());

		document.addEventListener('keydown', evt => {
			if (evt.keyCode === 32) {
				evt.preventDefault();
				evt.stopPropagation();
				this.togglePlayback();
			}
		});

		document.addEventListener('mousemove', evt => {
			this.show().autohide();
		});

		this._setupDrag();
	}

	togglePlayback() {
		if (this.timeline.state === 'play') {
			this.timeline.pause();
		} else {
			if (this.timeline.timecode === this.timeline.duration) {
				this.timeline.timecode = 0;
			}
			this.timeline.play();
		}
	}

	autohide() {
		this._resetAutohide();
		this._hideTimer = setTimeout(() => {
			if (!this.scrobbling && this.timeline.state === 'play') {
				this.hide();
			}
		}, 2000);
		return this;
	}

	_resetAutohide() {
		if (this._hideTimer) {
			clearTimeout(this._hideTimer);
		}
	}

	show() {
		this._resetAutohide();
		this.container.classList.remove('playback-controls_hidden');
		return this;
	}

	hide() {
		this.container.classList.add('playback-controls_hidden');
		return this;
	}

	_setupDrag(fn) {
		var dragData = null;
		var wasPlaying = false;

		var renderForCoord = x => {
			var w = dragData.rect.right - dragData.rect.left;
			x = Math.min(dragData.rect.right, Math.max(x, dragData.rect.left));
			var prc = (x - dragData.rect.left) / w;
			this.timeline.timecode = (prc * this.timeline.duration) | 0;
		};
		
		var onMove = evt => {
			if (!this.scrobbling) {
				this.scrobbling = Math.abs(dragData.x - evt.pageX) >= this.moveThreshold
					|| Math.abs(dragData.y - evt.pageY) >= this.moveThreshold;
			}

			if (this.scrobbling) {
				evt.preventDefault();
				this.timeline.pause();
				renderForCoord(evt.pageX);
			}
		};

		var onEnd = evt => {
			pointer.off(document, 'move', onMove);
			pointer.off(document, 'end', onEnd);
			if (wasPlaying) {
				this.timeline.play();
			} 

			if (!this.scrobbling) {
				renderForCoord(evt.pageX);
			}

			this.autohide();

			dragData = null;
			this.scrobbling = wasPlaying = false;
		};

		pointer.on(this.progressShaft, 'start', evt => {
			evt.preventDefault();
			dragData = {
				x: evt.pageX, 
				y: evt.pageY,
				rect: this.progressShaft.getBoundingClientRect()
			};
			wasPlaying = this.timeline.state === 'play';
			this.scrobbling = false;
			pointer.on(document, 'move', onMove);
			pointer.on(document, 'end', onEnd);
		});
	}
};