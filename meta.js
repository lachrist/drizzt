
module.exports = function (options, callback) {
  Melf({
    emitter: options.emitter,
    alias: options.alias,
    key: options.key
  }, function (error, melf) {
    if (error)
      return callback(error);
    var kalah = Kalah(melf, options.sync);
    melf.rprocedures["drizzt-instrument"] = function (origin, data, callback) {
      callback(null, options.instrument(data[0], data[1], data[2], origin));
    };
    melf.rprocedures["drizzt-namespace"] = function (origin, data, callback) {
      callback(null, options.namespace);
    };
    Object.keys(TrapTypes.arguments).forEach(function (name) {
      var type1 = TrapTypes.arguments[name];
      var type2 = TrapTypes.result[name];
      var trap = options.traps[name];
      if (options.sync) {
        melf.rprocedures["drizzt-"+name] = function (origin, data, callback) {
          try {
            var result = trap.apply(null, kalah.import(data, type1))
          } catch (error) {
            callback(error);
          }
          callback(null, type2 ? kalah.export(result, type2) : null);
        };
      } else {
        melf.rprocedures["drizzt-"+name] = function (origin, data, callback) {
          trap.apply(null, kalah.import(data, type1)).catch(callback).then(function (result) {
            callback(null, type2 ? kalah.export(result, type2) : null);
          });
        };
      }
    });
    callback(null);
  });
};
