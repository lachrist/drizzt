
var Drizzt = require("drizzt");
var Aran = require("aran");
var Melf = require("melf");
var Kalah = require("kalah");
var Minimist = require("minimist");

var aran = Aran();
var melf = Melf(Minimist(process.argv.slice(2))),
var kalah = Kalah(melf);

Drizzt({
  namespace: aran.namespace,
  melf: melf
  kalah: kalah,
  instrument: function (script, origin, source) {
    var program = Esprima.parse(script, {loc:true});
    program.origin = origin;
    program.source = source;
    return aran.instrument(program, ["apply"]);
  },
  trap: function (name, args, callback) {
    var index = arguments.pop();
    var node = aran.node(index);
    var program = aran.program(index);
    console.log("apply "+args[0].name+" "+program.origin+"@"+program.source+"#"+node.loc.start.line);
    try {
      callback(null, Reflect.apply(args[0], args[1], args[2]));
    } catch (error) {
      callback(error);
    }
  }
});
