/**
 * Toggles slide visibility on given time
 */
'use strict';
import {toArray, toggleClass} from '../utils';

export default class SlideToggleClip {
	constructor(slides, keyframes) {
		this.slides = toArray(slides);
		this.keyframes = Object.keys(keyframes)
		.map(key => {
			return {
				time: +key,
				className: keyframes[key]
			};
		})
		.sort((a, b) => a.time - b.time);
		this.render(0);
		this._prevState = null;
	}

	get duration() {
		return this.keyframes[this.keyframes.length - 1].time;
	}

	render(time) {
		var keyframe = this.keyframes
		.reduce((prev, frame) => frame.time <= time ? frame : prev, null);
		var className = keyframe ? keyframe.className : '';
		if (className !== this._prevState) {
			this.slides.forEach(slide => toggleClass(slide, 'qt-slide_hidden', !className || !slide.classList.contains(className)));
			this._prevState = className;
		}
	}
}