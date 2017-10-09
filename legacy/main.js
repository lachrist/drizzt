
var Path = require("path");
var OtilukeHtml = require("otiluke/html");
var OtilukeNode = require("otiluke/node");
var MelfIntercept = require("melf/intercept");
var Chalk = require("chalk");

module.exports = function (options) {
  var mintercept = MelfIntercept({splitter:options.splitter, debug:options.debug});
  return {
    intercept: mintercept,
    html: OtilukeHtml({
      intercept: mintercept,
      sphere: {
        path: __dirname+"/sphere.js",
        argument: {
          splitter: options.splitter,
          base: options.aliases.mitm,
          meta: options.aliases.meta
        }
      }
    }),
    node: OtilukeNode({
      intercept: mintercept,
      sphere: {
        path: __dirname+"/sphere.js",
        argument: {
          splitter: options.splitter,
          base: options.aliases.node,
          meta: options.aliases.meta
        }
      }
    }),
    meta: [
      __dirname+"/meta.js",
      "--drow", Path.resolve(options.drow),
      "--port", options.port,
      "--splitter", options.splitter,
      "--alias", options.aliases.meta,
    ]
  }
};
