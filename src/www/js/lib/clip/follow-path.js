/**
 * Moves given element by given cubic Bezier path
 */
'use strict';
import extend from 'xtend';
import AbstractClip from './abstract';
import {setStyle, bezier3} from '../utils';
import {easings} from '../tween';

var defaultOptions = {
	duration: 1000,
	flickerOffset: 0.5,
	reverse: false
};

export default class FollowPathClip extends AbstractClip {
	constructor(elem, path, options) {
		if (typeof options === 'number') {
			options = {duration: options};
		}
		options = extend(defaultOptions, options || {});
		super(elem, options.duration);
		this.path = path;
		this.options = options;
	}

	_render(time) {
		var prc = time / this.duration;
		var scale = 1, opacity = 1, x, y;

		// animate scaling
		var scaleUp = 0.2, scaleDown = 0.8;
		if (prc < scaleUp) {
			scale = easings.outCubic(prc, 0, 1, scaleUp);
		} else if (prc > scaleDown) {
			scale = 1 - easings.inCubic(prc - scaleDown, 0, 1, 1 - scaleDown);
		}

		// animate flickering
		if (this.options.flickerOffset) {
			opacity = Math.random() * this.options.flickerOffset + (1 - this.options.flickerOffset);
		}

		// animate path movement
		var t = this.options.reverse ? 1 - prc : prc;
		var p = this.path;
		x = bezier3(t, p[0][0], p[1][0], p[2][0], p[3][0]);
		y = bezier3(t, p[0][1], p[1][1], p[2][1], p[3][1]);

		setStyle(this.elem, {opacity}, {
			translateX: x,
			translateY: y,
			scale
		});
	}
}