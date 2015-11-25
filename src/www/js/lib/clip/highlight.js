/**
 * Highlights given element
 */
'use strict';
import AbstractClip from './abstract';
import {createElement, setTransform} from '../utils';
import {easings} from '../tween';

export default class HighlightClip extends AbstractClip {
	constructor(elem, duration=500) {
		super(elem, duration);

		this.hl = createElement('span', 'code-highlight');
		this.hl.style.opacity = 0;
		this.elem.classList.add('code-highlight-parent');
		this.elem.appendChild(this.hl);
	}

	_render(time) {
		var prc = time / this.duration;

		// animate highlighting layer
		var wndStart = 0.2, wndEnd = 0.6;
		var opacity = 1;
		if (prc < wndStart) {
			opacity = prc / wndStart;
		} else if (prc > wndEnd) {
			opacity = 1 - (prc - wndEnd) / (1 - wndEnd);
		}
		this.hl.style.opacity = opacity;

		// animate main element
		var scaleUp = 0.4, scaleDown = 0.8;
		var scaleDelta = 0.7, scale = 1;
		if (prc < scaleUp) {
			scale = 1 + easings.outCubic(prc, 0, 1, scaleUp) * scaleDelta;
		} else if (prc < scaleDown) {
			scale = 1 + (1 - easings.inCubic(prc - scaleUp, 0, 1, scaleDown - scaleUp)) * scaleDelta;
		}
		setTransform(this.elem, {scale});
	}

	reset() {
		setTransform(this.elem, 'none');
	}
}