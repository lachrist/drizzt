var Esprima = require("esprima");
var Aran = require("aran");
var Drizzt = require("drizzt");
var namespace = "meta";
var aran = Aran(namespace);
var pointcut = ["apply"];
function instrument (alias, source, script, global) {
  var program = Esprima.parse(script, {loc:true});
  program.alias = alias;
  program.source = source;
  program.global = global;
  return aran.instrument(program, pointcut);
};
var traps = {};
traps.apply = function (fct, ths, args, idx) {
  if (fct === aran.program(idx).stringify)
    fct[]
  console.log({
    function: fct.name,
    alias: aran.program(idx).alias,
    source: aran.program(idx).source,
    location: aran.node(idx).loc.start
  });
  return Reflect.apply(fct, ths, args);
};
Drizzt({
  instrument: instrument,
  namespace: namespace,
  traps: traps,
  ports: {
    node: 8000,
  }
}, function (error, child) {
  if (error)
    throw error;
  child.on("error", function (error) {
    throw error;
  });
  child.on("exit", function (code, signal) {
    throw new Error("Orchestrator exit "+code+" "+signal);
  });
});
