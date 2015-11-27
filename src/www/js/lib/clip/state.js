/**
 * State clip simply changes value of `data-qt-state` with given value
 * on given time
 */
'use strict';
import AbstractClip from './abstract';

export default class StateClip extends AbstractClip {
	constructor(elem, keyframes) {
		super(elem);
		this.keyframes = Object.keys(keyframes)
		.map(key => ({time: +key, state: keyframes[key]}))
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
		var state = keyframe ? keyframe.state : '';
		if (state !== this._prevState) {
			this.elem.setAttribute('data-state', state);
			this._prevState = state;
		}
	}
}