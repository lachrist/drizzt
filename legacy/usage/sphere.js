// This analysis traps everything and forward all operations //
var Aran = require("aran");
var Esprima = require("esprima");
var JsBeautify = require("js-beautify");
var ForwardTraps = require("aran/forward-traps");
module.exports = function (argument, client) {
  var namespace = "_aran_";
  var drizzt = Drizzt(namespace, ForwardTraps);
  var lens = Object.keys(global[namespace]);
  return function (script, origin, source) {
    var program = Esprima.parse(script);
    return JsBeautify.js_beautify(aran.instrument(program, lens));
  };
};