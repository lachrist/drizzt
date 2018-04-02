const Astring = require("astring");
const Acorn = require("acorn");
const Aran = require("aran");
const Drizzt = require("drizzt");
const aran = Aran({namespace:"META"});
Drizzt({
  traps: [],
  emitter: process.emitter,
  instrument: (script, source, origin) => Astring.generate(aran.weave(Acorn.parse(script), false, null)),
  initialize: (global, origin) => ({
    namespace: "META",
    sync: true,
    setup: Astring.generate(aran.setup(false)),
    sandbox: null
  })
}, (error) => {
  if (error) throw error;
  console.log("Analysis Ready");
});