
var Esprima = require("esprima");

module.exports = function (aran, melf, kalah) {
  var traps = {};
  traps.apply = function (fct, ths, args, idx) {
    var program = aran.program(idx);
    var node = aran.node(idx);
    console.log("apply "+fct.name+" "+program.origin+"@"+program.source+"#"+node.loc.start.line);
    console.log(fct.name);
    console.log(ths);
    console.log(args);
    console.log(idx);
    return Reflect.apply(fct, ths, args);
  };
  global[aran.namespace] = traps;
  return function (origin, script, source) {
    var program = Esprima.parse(script, {loc:true});
    program.origin = origin;
    program.source = source;
    return aran.instrument(program, Object.keys(traps));
  };
};
