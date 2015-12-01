var EmmetCodemirror = require('emmet-codemirror');
var CodeMirror = require('codemirror');

require('codemirror/mode/css/css.js');
require('codemirror/keymap/sublime.js');
require('codemirror/addon/hint/show-hint.js');

window.CodeMirror = CodeMirror;
window.EmmetCodemirror = EmmetCodemirror;
window.emmet = EmmetCodemirror.emmet;

EmmetCodemirror.setup(CodeMirror);