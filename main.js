
var Path = require("path");
var ChildProcess = require("child_process");
var EmitterNode = require("antena/emitter/node");
var Melf = require("melf");
var Kalah = require("kalah");
var TrapTypes = require("./trap-types.js");
var Chalk = require("chalk");

module.exports = function (options, callback) {
  options.alias = options.alias || "drizzt";
  options.key = options.key || Math.random().toString(36).substring(2);
  options.namespace = options.namespace || "drizzt"+Math.random().toString(36).substring(2);
  options.ports = options.ports || {};
  if ("meta" in options.ports)
    argv.push("--meta-port", options.ports.meta);
  if ("node" in options.ports)
    argv.push("--node-port", options.ports.node);
  if ("html" in options.ports)
    argv.push("--browser-port", options.ports.browser);
  var child = ChildProcess.fork(Path.join(__dirname, "orchestrator.js"), argv, {stdio:["ignore", "pipe", "pipe", "ipc"]});
  process.on("exit", function () {
    child.kill();
  });
  child.stdout.on("data", function (data) {
    process.stdout.write(Chalk.blue(data));
  });
  child.stderr.on("data", function (data) {
    process.stderr.write(Chalk.blue(data));
  });
  function cleanup (error) {
    child.removeAllListeners("message");
    child.removeAllListeners("error");
    child.removeAllListeners("exit");
    child.kill("SIGTERM");
    callback(error);
    callback = function () {};
  }
  child.on("error", cleanup);
  child.on("exit", function (code, signal) {
    cleanup(new Error("Exit "+code+" "+signal));
  });
  child.on("message", function (port) {
    child.removeAllListeners("message");
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
  });
};
