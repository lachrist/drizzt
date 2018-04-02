const MelfReceptor = require("melf/receptor/worker");
const AntenaSpawn = require("antena-spawn/worker");
module.exports = (deploy) => {
  const receptor = MelfReceptor();
  const spawn = AntenaSpawn(receptor, 16 * 1024);
  const childeren = [];
  const broadcast = function (message) {
    childeren.forEach((child) => {
      child === this || child.send(message); 
    });
  };
  let first = true;
  return (path, script, argv) => {
    if (first) {
      first = false;
      return spawn(script, argv);
    }
    const child = spawn([
      "const PATH = "+JSON.stringify(path)+";",
      "const SCRIPT = "+JSON.stringify(script)+";",
      "const ALIAS = "+JSON.stringify(/\/([^/]+)\.js/.exec(path)[1])+";",
      deploy
    ].join("\n"), argv);
    child.on("message", broadcast);
    childeren.push(child);
    return child;
  };
};
