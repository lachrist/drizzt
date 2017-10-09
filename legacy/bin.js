
var ChildProcess = require("child_process");
var Http = require("http");
var Ws = require("ws");
var Fs = require("fs");
var Path = require("path");
var Otiluke = require("otiluke");
var MelfHijack = require("melf/hijack");
var Chalk = require("chalk");

var splitter = "drizzt-splitter";
var aliases = {
  node: "node",
  mitm: "mitm",
  meta: "meta"
};
var ports = {
  node: __dirname+"/socket-node",
  mitm: 8080,
  meta: __dirname+"/socket-meta"
};

function unlink (path) {
  try {
    Fs.unlinkSync(path);
  } catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

unlink(ports.node);
unlink(ports.meta);

var mhijack = MelfHijack(splitter);
mhijack.on("authentify", function (alias) { console.log(alias+ " authentified") });
mhijack.on("connect", function (alias) { console.log(alias+" connected") });
mhijack.on("disconnect", function (alias) { console.log(alias+" disconnected") });

(function () {
  var server = Http.createServer(mhijack.request);
  (new Ws.Server({server:server})).on("connection", mhijack.socket);
  server.listen(ports.meta, function () {
    var child = ChildProcess.spawn("node", [
        __dirname+"/meta.js",
        "--drow", Path.resolve(process.argv[2]),
        "--host", ports.meta,
        "--splitter", splitter,
        "--alias", aliases.meta,
      ], {stdio:["ignore", "pipe", "pipe"], encoding:"utf8"});
    child.stdout.on("data", function (data) {
      process.stdout.write(Chalk.green(data));
    });
    child.stderr.on("data", function (data) {
      process.stderr.write(Chalk.red(data));
    });
  });
} ());

function make (name) {
  return {
    port: ports[name],
    hijack: mhijack,
    sphere: {
      path: __dirname+"/sphere.js",
      json: {
        splitter: splitter,
        base: aliases[name],
        meta: aliases.meta
      }
    }
  };
}

function escape (arg) { return "'"+arg.replace("'", "'''")+"'" }
Otiluke.node(make("node"), function (error, server, arguments) {
  if (error)
    throw error;
  console.log("Node arguments: "+arguments.map(escape).join(" "));
});

Otiluke.mitm(make("mitm"), function (error, proxy) {
  if (error)
    throw error;
  console.log("Browser proxy: http://localhost:"+proxy.address().port);
});
