
var Melf = require("melf");
var Kalah = require("kalah");
var TrapTypes = require("./trap-types.js");

module.exports = (options, callback) => {
  Melf({
    emitter: options.emitter,
    alias: "drizzt",
    key: options.key || ""
  }, (error, melf) => {
    if (error)
      return callback(error);
    const kalah = Kalah(melf, {sync:options.sync});
    melf.rprocedures["drizzt-instrument"] = (origin, data, callback) => {
      callback(null, options.instrument(data[0], data[1], origin));
    };
    melf.rprocedures["drizzt-initialize"] = (origin, data, callback) => {
      data = options.initialize(kalah.import(data, "reference"), origin);
      callback(null, {
        namespace: data.namespace,
        setup: data.setup,
        sandbox: kalah.export(data.sandbox, "any")
      });
    };
    Object.keys(TrapTypes).forEach((name) => {
      if (options.sync) {
        melf.rprocedures["drizzt-"+name] = (origin, data, callback) => {
          try {
            var result = options.traps[name].apply(null, kalah.import(data, TrapTypes[name]))
          } catch (error) {
            callback(error);
          }
          callback(null, kalah.export(result, "any"));
        };
      } else {
        melf.rprocedures["drizzt-"+name] = (origin, data, callback) => {
          options.traps[name].apply(null, kalah.import(data, TrapTypes[name])).catch(callback).then((result) => {
            callback(null, kalah.export(result, "any"));
          });
        };
      }
    });
    callback(null);
  });
};
