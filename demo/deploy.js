const DrizztVirus = require("drizzt/src/virus");
global.process = process;
global.console = console;
DrizztVirus(ALIAS, process.emitter, (error, instrument) => {
  if (error)
    throw error;
  global.eval(instrument(SCRIPT, PATH));
});