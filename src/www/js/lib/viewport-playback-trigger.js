/**
 * A controller for triggering timeline playback depending on its visibility
 * in given (browser) viewport
 */
'use strict';

export default class ViewportPlaybackTrigger {
	constructor(timeline) {
		this.timeline = timeline;
		this._rect = null;
		this._playTimer = null;
		this._stopTimer = null;

		this.play = () => {
			this.resetStopSchedule();
			this.resetPlaySchedule();
			timeline.play();
		};

		this.stop = () => {
			this.resetStopSchedule();
			this.resetPlaySchedule();
			timeline.stop();
		};
	}

	check(viewportRect) {
		if (this.shouldPlay(viewportRect)) {
			this.schedulePlay();
		} else if (this.shouldStop(viewportRect)) {
			this.scheduleStop();
		}
	}

	get rect() {
		if (!this._rect) {
			let r = this.timeline.elem.getBoundingClientRect();
			let dy = getScrollY();
			this._rect = {
				top: r.top + dy,
				bottom: r.bottom + dy,
				left: r.left,
				right: r.right
			};
		}
		return this._rect;
	}

	resetRect() {
		this._rect = null;
	}

	resetStopSchedule() {
		if (this._stopTimer) {
			clearTimeout(this._stopTimer);
			this._stopTimer = null;
		}
	}

	resetPlaySchedule() {
		if (this._playTimer) {
			clearTimeout(this._playTimer);
			this._playTimer = null;
		}
	}

	scheduleStop() {
		this.resetPlaySchedule();
		if (!this._stopTimer) {
			this._stopTimer = setTimeout(this.stop, 1000);
		}
	}

	schedulePlay() {
		this.resetStopSchedule();
		this.resetPlaySchedule();
		this._playTimer = setTimeout(this.play, 500);
	}

	shouldPlay(viewportRect) {
		return overlappingRatio(this.rect, viewportRect) > 0.5;
	}

	shouldStop(viewportRect) {
		return !isOverlap(this.rect, viewportRect);
	}
};

function isOverlap(rect1, rect2) {
	return rect1.top <= rect2.bottom && rect1.bottom >= rect2.top;
}

function overlappingRatio(slideRect, viewportRect) {
	if (isOverlap(slideRect, viewportRect)) {
		// calculate overlapping area
		var vpHeight = viewportRect.bottom - viewportRect.top;
		var slideHeight = slideRect.bottom - slideRect.top;
		var overlappingHeight = Math.min(slideRect.bottom, viewportRect.bottom) 
			- Math.max(slideRect.top, viewportRect.top);

		return overlappingHeight / Math.min(vpHeight, slideHeight);
	}
	return 0;
}

function getScrollY() {
	return window.pageYOffset;
}