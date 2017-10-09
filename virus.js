
var Melf = require("melf");
var Kalah = require("kalah");
var TrapTypes = require("./trap-types.js");

module.exports = function (alias, emitter, callback) {
  var emitters = emitter.split(["register", "melf"]);
  emitters.register.request("GET", "/"+alias, {}, "", function (error, status, reason, headers, body) {
    if (error || status !== 200)
      return callback(error || new Error(status+" "+reason));
    var init = JSON.parse(body);
    Melf({
      emitter: emitters.melf,
      alias: init.alias,
      key: init.key
    }, function (error, melf) {
      if (error)
        return callback(error);
      var kalah = Kalah(melf);
      global[init.namespace] = {};
      Object.keys(TrapTypes.arguments).forEach(function (name) {
        var type1 = TrapTypes.arguments[name];
        var type2 = TrapTypes.result[name];
        global[init.namespace][name] = function () {
          var result = melf.rpc(init.meta, "drizzt-"+name, kalah.export(arguments, type1));
          return type2 ? kalah.import(result, type2) : undefined;
        };
      });
      callback(null, function (source, script) {
        return melf.rpc(init.meta, "drizzt-instrument", [source, script, kalah.export(global, "reference")]);
      });
    });
  });
};
