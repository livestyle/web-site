/**
 * A simple method for highlighting CSS code with HTML code.
 * Receives object where keys with objects are treated like selectors and 
 * keys with simple values like properties
 */
'use strict';

var render = module.exports = function(code, indent) {
	return Object.keys(code)
	.map(key => {
		var value = code[key];
		return value && typeof value === 'object' 
			? renderSelector(key, value) 
			: renderProperty(key, value)
	}).join('\n');
};

function renderSelector(sel, contents) {
	return line(`${token(sel, 1)} {`) + render(contents) + line('}');
}

function renderProperty(name, value, indent) {
	indent = indent || '    ';
	return line(`${indent}${token(name, 2)} ${token(value, /^\d+/.test(value) ? 3 : 4)};`);
}

function line(code) {
	return `<div class="code-line">${code}</div>`;
}

function token(code, type) {
	if (/^\[.+?\]$/.test(code)) {
		code = `<span class="code-token-wrap">${code.slice(1, -1)}</span>`;
	}
	return `<span class="code-token code-token_${type}">${code}</span>`;
}