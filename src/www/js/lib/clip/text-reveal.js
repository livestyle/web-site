/**
 * Reveals text with gradient mask
 */
'use strict';

import extend from 'xtend';
import AbstractClip from './abstract';
import {setStyle, setTransform, toArray, createElement, removeElement, minmax} from '../utils';
import {easings} from '../tween';

var defaultOptions = {
	duration: 300,
	headSize: 100,
	easing: 'linear'
};

export default class TextReavealClip extends AbstractClip {
	constructor(elem, options={}) {
		if (typeof options === 'number') {
			options = {duration: options};
		}
		options = extend(defaultOptions, options);
		super(elem, options.duration);
		this.distance = -1;
		this.lines = null;
		this.options = options;
		this.easing = options.easing;
		this._hidden = false;
		if (typeof this.easing === 'string') {
			this.easing = easings[this.easing];
			if (!this.easing) {
				console.warn('Unknown easing "%s", using "linear" instead', options.easing);
				this.easing = easings.linear;
			}
		}

		this._hide();
	}

	_render(time) {
		if (time === 0) {
			this._hide()._removeShade();
		} else if (time === this.duration) {
			this._show()._removeShade();
		} else {
			this._show()._addShade();
			var pos = this.distance * this.easing(time, 0, 1, this.duration);
			var offset = 0, trf = {};
			for (var i = 0, il = this.lines.length, line; i < il; i++) {
				line = this.lines[i];
				trf.translateX = minmax(pos, 0, line.distance);
				setTransform(line.elem, trf);
				pos -= line.distance;
			}
		}
	}

	_hide() {
		if (!this._hidden) {
			this.elem.classList.add('qt-invisible');
			this._hidden = true;
		}
		return this;
	}

	_show() {
		if (this._hidden) {
			this.elem.classList.remove('qt-invisible');
			this._hidden = false;
		}
		return this;
	}

	_addShade() {
		if (!this.lines) {
			var parent = this.elem.offsetParent;
			this.lines = getLines(this.elem, this.options);
			this.distance = this.lines.reduce((d, line) => {
				parent.appendChild(line.elem);
				return d + line.distance;
			}, 0);
		}
		return this;
	}

	_removeShade() {
		if (this.lines) {
			this.lines.forEach(line => removeElement(line.elem));
			this.lines = null;
			this.distance = -1;
		}
		return this;
	}
}

/**
 * Returns text lines rectangles for given element. Rectangles positions
 * are calculated relative to element’s offsetParent
 * @param  {Element} elem
 * @return {Array}
 */
function getLines(elem, options) {
	var parentRect = elem.offsetParent.getBoundingClientRect();
	return toArray(elem.getClientRects()).map(rect => {
		var elem = createElement('span', 'qt-shade');
		var line = {
			left: rect.left - parentRect.left,
			top: rect.top - parentRect.top,
			width: rect.right - rect.left,
			height: rect.bottom - rect.top
		};
		setStyle(elem, line);
		line.elem = elem;
		line.distance = line.width + options.headSize;
		return line;
	});
}