/**
 * Animates text (with simple HTML styling) input into given element
 */
'use strict';
import extend from 'xtend';
import AbstractClip from './abstract';
import {toggleClass} from '../utils';

var defaultOptions = {
	beforeDelay: 100,          // delay before input start
	duration: 600,             // actual text input animation duration
	afterDelay: 100,           // delay after all characters are inserted 
	activeClass: 'qt-tx-caret' // class name to add to element when animation is active
};

export default class TextInputClip extends AbstractClip {
	constructor(elem, inputValue, options={}) {
		super(elem);
		this._curValue = this.elem.innerHTML;
		this.initialValue = parseText(this._curValue);
		this.inputValue = parseText(inputValue);
		if (typeof options === 'number') {
			options = {duration: options};
		}
		this.options = extend(defaultOptions, options);
		this._totalChars = this.initialValue.chars.length + this.inputValue.chars.length;
	}

	get duration() {
		return this.options.beforeDelay + this.options.duration + this.options.afterDelay;
	}

	render(time, absTime=time) {
		if (this.options.activeClass) {
			toggleClass(this.elem, this.options.activeClass, absTime > 0 && absTime < this.duration);
		}
		
		var result = '';
		if (time < this.options.beforeDelay) {
			result = renderString(this.initialValue);
		} else if (time > this.duration - this.options.afterDelay) {
			result = renderString(this.inputValue);
		} else {
			time -= this.options.beforeDelay;
			var curChar = (this._totalChars * (time / this.options.duration))|0;
			if (curChar < this.initialValue.chars.length) {
				result = renderString(this.initialValue, this.initialValue.chars.length - curChar);
			} else {
				result = renderString(this.inputValue, curChar - this.initialValue.chars.length);
			}
		}

		if (result !== this._curValue) {
			this.elem.innerHTML = this._curValue = result;
		}
	}
};

function renderString(parsedStr, totalChars) {
	if (typeof totalChars === 'undefined' || totalChars === parsedStr.chars.length) {
		return parsedStr.original;
	}

	if (!totalChars) {
		return '';
	}

	var result = parsedStr.base;
	for (var i = 0, ci; i < totalChars; i++) {
		ci = parsedStr.chars[i];
		result = result.substring(0, ci) + parsedStr.original[ci] + result.substring(ci);
	}
	return result;
}

function parseText(str) {
	var result = {
		chars: [],
		base: '',
		original: str
	};
	var i = 0, j = 0, il = str.length;
	while (i < il) {
		if (str[i] === '<') {
			j = eatTag(str, i);
			result.base += str.substring(i, j);
			i = j;
			continue;
		}

		result.chars.push(i++);
	}
	return result;
}

function eatTag(str, i) {
	// very basic tag matching: assume it’s something between < and >
	var il = str.length;
	while (i < il) {
		if (str[i] === '"' || str[i] === "'") {
			i = eatQuoted(str, i);
			continue;
		}
		if (str[i++] === '>') {
			break;
		}
	}
	return i;
}

function eatQuoted(str, i) {
	// consume single- or double-quoted value
	var quote = str[i++];
	var il = str.length;
	while (i < il) {
		if (str[i++] === quote) {
			break;
		}
	}
	return i;
}