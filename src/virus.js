
const Melf = require("melf");
const Kalah = require("kalah");
const TrapTypes = require("./trap-types.js");

const makeopts = (login, emitter) => {
  const index = login.indexOf("/");
  const alias = index === -1 ? login : login.substring(0, index);
  const key = index === -1 ? "" : login.substring(index+1);
  return {emitter:emitter, alias:alias, key:key};
};

module.exports = (login, emitter, callback) => {
  Melf(makeopts(login, emitter), (error, melf) => {
    if (error)
      return callback(error);
    const kalah = Kalah(melf, {sync:true});
    global.global = global;
    global.Symbol = {}; // TODO re-enable symbols
    melf.rcall("drizzt", "drizzt-initialize", kalah.export(Object.create(global), "reference"), (error, data) => { // TODO pass actual global???
      if (error)
        return callback(error);
      global[data.namespace] = {GLOBAL:kalah.import(data.sandbox, "any")};
      Object.keys(TrapTypes).forEach((name) => {
        global[data.namespace][name] = function () {
          return kalah.import(melf.rcall("drizzt", "drizzt-"+name, kalah.export(arguments, TrapTypes[name])), "any");
        };
      });
      global.eval(data.setup);
      callback(null, (script, source) => melf.rcall("drizzt", "drizzt-instrument", [script, source]));
    });
  });
};
