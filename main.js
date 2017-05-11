
var Path = require("path");
var Otiluke = require("otiluke");
var MelfHijack = require("melf/hijack");
var Chalk = require("chalk");

module.exports = function (options) {
  var mhijack = MelfHijack({splitter:options.splitter, debug:options.debug});
  return {
    hijack: mhijack,
    mitm: Otiluke.mitm({
      hijack: mhijack,
      sphere: {
        path: __dirname+"/sphere.js",
        json: {
          splitter: options.splitter,
          base: options.aliases.mitm,
          meta: options.aliases.meta
        }
      }
    }),
    node: Otiluke.node.argv({
      port: options.ports.node,
      sphere: {
        path: __dirname+"/sphere.js",
        json: {
          splitter: options.splitter,
          base: options.aliases.node,
          meta: options.aliases.meta
        }
      }
    }),
    meta: [
      __dirname+"/meta.js",
      "--drow", Path.resolve(options.drow),
      "--port", options.ports.meta,
      "--splitter", options.splitter,
      "--alias", options.aliases.meta,
    ]
  }
};
