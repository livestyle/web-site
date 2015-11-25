/**
 * Abstract clip definition, based on DOM element
 */
'use strict';

export default class AbstractClip {
	constructor(elem, duration=null) {
		if (typeof elem === 'string') {
			elem = document.querySelector(elem);
		}

		if (!elem || !('nodeType' in elem)) {
			throw new TypeError('No element given or element is not a DOM node');
		}

		this.elem = elem;
		this._hidden = false;
		this._duration = duration;
		this._prevTime = null;
	}

	show() {
		if (this._hidden) {
			this.elem.style.visibility = 'visible';
			this._hidden = false;
		}
	}

	hide() {
		if (!this._hidden) {
			this.elem.style.visibility = 'hidden';
			this._hidden = true;
		}
	}

	get hidden() {
		return this._hidden;
	}

	get duration() {
		return this._duration || 0;
	}

	render(time, absTime) {
		if (time === this._prevTime) {
			return;
		}

		this._prevTime = time;
		this._render(time, absTime);

		if (this.reset && (absTime <= 0 || (this.duration && absTime >= this.duration))) {
			this.reset();
		}
	}
};