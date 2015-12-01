/**
 * A minimal app required to add LiveStyle Analyzer support:
 * 1. Import `analyzer.js` file either as <script> tag or Require.js module.
 *    When imported as <script> tag, global `analyzer` function will be available.
 * 2. Init Anlayzer app by passing CodeMirror editor instance and 
 *    `option` argument with `worker` property that points to 
 *    LiveStyle engine worker file. Path must be either absolute
 *    or relative to host HTML page.
 */
import analyzerApp from './analyzer-app';

// setup app UI
var codeSamples = {};
$$('script').forEach(function(elem) {
	if (/^text\/x-/.test(elem.type)) {
		// bummer, my HTML importer forcibly replaces & with &amp;
		// Revert it back
		codeSamples[elem.type] = elem.innerHTML.trim().replace(/&amp;/g, '&');
	}
});

var syntaxPicker = $('select[name="syntax"]');
syntaxPicker.addEventListener('change', pickSyntax);

// setup CodeMirror instance
var editor = CodeMirror.fromTextArea($('#editor'), {
	lineNumbers: true,
	indentWithTabs: true,
	indentUnit: 4
});
EmmetCodemirror(editor);
pickSyntax();

// init LiveStyle analyzer
var app = analyzerApp(editor, {worker: '/js/worker.js'});
$$('[data-action="show-outline"]').forEach(item => item.addEventListener('click', app.showOutline));

editor.focus();

///////////////////// helpers

function $(sel, context) {
	return (context || document).querySelector(sel);
}

function $$(sel, context) {
	var res = (context || document).querySelectorAll(sel);
	return Array.prototype.slice.call(res, 0);
}

function pickSyntax() {
	var syntax = syntaxPicker.value;
	editor.setOption('mode', syntax);
	editor.setValue(codeSamples[syntax]);
}