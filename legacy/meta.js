var Minimist = require("minimist");
var Client = require("client-uniform/node");
var Melf = require("melf");
var Kalah = require("kalah");
var TrapTypes = require("./trap-types.js");
var Aran = require("aran");

var options = Minimist(process.argv.slice(2));
var melf = Melf({
  client: Client(options.port, false),
  splitter: options.splitter,
  alias: options.alias
});
var kalah = Kalah(melf);
var aran = Aran();
var instrument = require(options.drow)(aran, melf, kalah);
melf.on("aran-namespace", function (origin, data, callback) {
  callback(null, aran.namespace);
});
melf.on("aran-instrument", function (origin, data, callback) {
  callback(null, kalah.export(function (script, source) {
    return instrument(origin, script, source);
  }, "reference"));
});

Object.keys(TrapTypes.arguments).forEach(function (name) {
  var type1 = TrapTypes.arguments[name];
  var type2 = TrapTypes.result[name];
  if (typeof global[aran.namespace] === "function") {
    var listener = function (origin, data, callback) {
      global[aran.namespace](name, kalah.import(data, type1), function (error, result) {
        if (error)
          return callback(error);
        callback(null, type2 ? kalah.export(result, type2) : null);
      });
    }
  } else {
    var listener = function (origin, data, callback) {
      // try {
      var result = global[aran.namespace][name].apply(global[aran.namespace], kalah.import(data, type1));
      // } catch (error) {
      //   throw error;
      //   return callback(error);
      // }
      callback(null, type2 ? kalah.export(result, type2) : null);
    }
  }
  melf.on("aran-"+name, listener);
});
