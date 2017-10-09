
var Path = require("path");
var Http = require("http");
var Minimist = require("minimist");
var OtilukeServerNode = require("otiluke/server/node");
var OtilukeServerBrowser = require("otiluke/server/browser");
var Receptor = require("antena/receptor/node");
var MelfReceptor = require("melf/receptor/node");

var options = Minimist(process.argv.slice(2));
var keys = {};
keys[options.alias] = options.key;
var mreceptor = MelfReceptor(keys);
var handlers = mreceptor.handlers();
var server = Http.createServer();
server.listen(options["meta-port"] || 0, function () {
  process.send(server.address().port);
});
server.on("request", handlers.request);
server.on("upgrade", handlers.upgrade);
var receptor = Receptor({}).merge({
  melf: mreceptor,
  register: Receptor({
    onrequest: function (method, path, headers, body, callback) {
      var alias = path.substring(1);
      var counter = 0;
      while (alias+counter in keys)
        counter++;
      alias = alias+counter;
      keys[alias] = Math.random().toString(36).substring(2);
      callback(200, "ok", {}, JSON.stringify({
        alias: alias,
        key: keys[alias],
        namespace: options.namespace,
        meta: options.alias
      }));
    }
  })
});

if ("node-port" in options)
  OtilukeNode(Path.join(__dirname, "virus.js"), receptor).listen(options["node-port"]);
if ("browser-port" in options)
  OtilukeBrowser(Path.join(__dirname, "virus.js"), receptor).listen(options["browser-port"]);
