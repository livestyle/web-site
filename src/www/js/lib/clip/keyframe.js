/**
 * Keyframe clip contains entries with key style positions of given element
 * and interpolates values between them
 */
'use strict';
import extend from 'xtend';
import AbstractClip from './abstract';
import {setTransform, setStyle} from '../utils';
import {easings} from '../tween';

var propMappings = {
	x: 'translateX',
	y: 'translateY'
};

var defaultEasing = 'linear';

export default class KeyframeClip extends AbstractClip {
	constructor(elem, keyframes) {
		super(elem);
		this._keyframes = null;
		this.keyframes = keyframes;
	}

	set keyframes(kf) {
		if (!kf || typeof kf !== 'object') {
			throw new TypeError('No keyframes given or keyframes are not an object');
		}

		var prev = null;
		this._keyframes = resolveKeyframes(kf);
		this._duration = null;
	}

	get duration() {
		if (this._duration === null) {
			this._duration = this._keyframes.length > 1 
				? this._keyframes[this._keyframes.length - 1].time
				: 0;
		}
		return this._duration;
	}

	_render(time) {
		// split keyframes in two parts: before and after current timecode
		// if (this.elem.classList.contains('qt-livestyle')) {
		// 	debugger;
		// }
		
		var prev = {}, next = {};
		this._keyframes.forEach(keyframe => {
			var dest = keyframe.time <= time ? prev : next;
			Object.keys(keyframe.props).forEach(name => {
				if (dest === next && name in dest) {
					return;
				}

				dest[name] = {
					time: keyframe.time, 
					value: keyframe.props[name]
				};
			});
		});

		// interpolate values between before and after keyframes
		var transform = {}, style = {};
		Object.keys(prev).forEach(name => {
			var value = prev[name].value[0];
			if (name in next) {
				let easing = prev[name].value[1];
				let duration = next[name].time - prev[name].time;
				let pos = easing(time - prev[name].time, 0, 1, duration);
				value += (next[name].value[0] - value) * pos;
			}

			transform[propMappings[name] || name] = value;
		});

		// `opacity` is the only property outside of `transform`:
		// reset it’s value if required
		if ('opacity' in next && !('opacity' in prev)) {
			transform.opacity = '';
		}

		if ('opacity' in transform) {
			style.opacity = transform.opacity;
			delete transform.opacity;
		}

		setStyle(this.elem, style, transform);
	}
}

function resolveKeyframes(kf) {
	var result = [];
	var prevLookup = {opacity: 1};

	if (!Array.isArray(kf)) {
		let prevTime = 0;
		kf = Object.keys(kf).map(key => {
			var time = +key;
			if (key[0] === '+') {
				time += prevTime;
			}
			prevTime = time;
			return {time, props: kf[key]}; 
		});
	}

	return kf
	.sort((a, b) => a.time - b.time)
	.map(item => {
		var props = extend(item.props);
		var easing = props.transition || defaultEasing;
		delete props.transition;
		Object.keys(props).forEach(key => {
			var value = props[key];
			if (!Array.isArray(value)) {
				value = [value, easing];
			}

			if (typeof value[0] === 'string') {
				value[0] = (prevLookup[key] || 0) + parseInt(value[0]);
			}

			if (typeof value[1] === 'string') {
				if (value[1] in easings) {
					value[1] = easings[value[1]];
				} else {
					console.warn('Unable to find "%s" easing, using "linear"', value[1]);
					value[1] = easings.linear;
				}
			}

			props[key] = value;
			prevLookup[key] = value[0];
		});
		item.props = props;
		return item;
	});

}