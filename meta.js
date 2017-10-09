
module.exports = function (options) {
  
}

Melf({
  emitter: EmitterNode(port, false).trace("meta"),
  alias: options.alias,
  key: options.key
}, function (error, melf) {
  if (error)
    return cleanup(error);
  var kalah = Kalah(melf, options.sync);
  melf.rp("drizzt-instrument", function (origin, data, callback) {
    callback(null, options.instrument(origin, data[0], data[1]));
  });
  Object.keys(TrapTypes.arguments).forEach(function (name) {
    var type1 = TrapTypes.arguments[name];
    var type2 = TrapTypes.result[name];
    var trap = options.traps[name];
    if (options.sync) {
      melf.rp("drizzt-"+name, function (origin, data, callback) {
        try {
          var result = trap.apply(null, kalah.import(data, type1))
        } catch (error) {
          callback(error);
        }
        callback(null, type2 ? kalah.export(result, type2) : null);
      });
    } else {
      melf.rp("drizzt-"+name, function (origin, data, callback) {
        trap.apply(null, kalah.import(data, type1)).catch(callback).then(function (result) {
          callback(null, type2 ? kalah.export(result, type2) : null);
        });
      });
    }
  });
  child.removeAllListeners("error");
  child.removeAllListeners("exit");
  callback(null, child);
});