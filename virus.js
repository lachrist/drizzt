
var Melf = require("melf");
var Kalah = require("kalah");
var TrapTypes = require("./trap-types.js");

module.exports = function (login, emitter, callback) {
  var index = loging.indexOf(login);
  Melf({
    emitter: emitter,
    alias: index === -1 ? login : login.substring(0, index),
    key: index === -1 ? "" : login.substring(index+1)
  }, function (error, melf) {
    if (error)
      return callback(error);
    melf.rcall("drizzt", "drizzt-namespace", null, function (error, namespace) {
      var kalah = Kalah(melf);
      global[namespace] = {};
      Object.keys(TrapTypes.arguments).forEach(function (name) {
        var type1 = TrapTypes.arguments[name];
        var type2 = TrapTypes.result[name];
        global[namespace][name] = function () {
          var result = melf.rpc("drizzt", "drizzt-"+name, kalah.export(arguments, type1));
          return type2 ? kalah.import(result, type2) : void 0;
        };
      });
      callback(null, function (source, script) {
        return melf.rpc("drizzt", "drizzt-instrument", [script, source, kalah.export(global, "reference")]);
      });
    });
  });
};


//   emitters.register.request("GET", "/"+alias, {}, "", function (error, status, reason, headers, body) {
//     if (error || status !== 200)
//       return callback(error || new Error(status+" "+reason));
//     var init = JSON.parse(body);
//     Melf({
//       emitter: emitters.melf,
//       alias: init.alias,
//       key: init.key
//     }, function (error, melf) {
      
//   });
// };
