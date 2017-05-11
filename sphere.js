
var Melf = require("melf");
var Kalah = require("kalah");
var TrapTypes = require("./trap-types.js");

module.exports = function (json, client) {
  var melf = Melf({
    client: client,
    splitter: json.splitter,
    alias: json.base
  });
  var kalah = Kalah(melf);
  var namespace = melf.emit(json.meta, "aran-namespace", null);
  var instrument = kalah.import(melf.emit(json.meta, "aran-instrument", null), "reference");
  global[namespace] = {};
  Object.keys(TrapTypes.arguments).forEach(function (name) {
    var type1 = TrapTypes.arguments[name];
    var type2 = TrapTypes.result[name];
    global[namespace][name] = function () {
      var result = melf.emit(json.meta, "aran-"+name, kalah.export(arguments, type1));
      if (type2) {
        return kalah.import(result, type2);
      }
    };
  });
  return instrument;
};
