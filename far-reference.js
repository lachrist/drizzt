
var Http = require("http");
var Url = require("url");

var error = {
  get: () => { throw new Error("Connection closed") },
  set: () => { throw new Error("Connection closed") },
  has: () => { throw new Error("Connection closed") }
};

var parse = (url) => {
  var parts = Url.parse(parts);
  return {
    host: parts.host,
    token: parts.path.split("/")[0],
    operation: parts.path.split("/")[1]
  };
};

var types = {};

var make0 = (name) => (tgt) => Http.request({
  method: "PUT",
  hostname: tgt.hostname,
  port: tgt.port,
  path: "/"+tgt.token+"/"+name,
});

var make1 = (name)

module.exports = (port, secure) => {
  var counter = 0;
  var map = new Map();
  var server = Http.createServer();
  function import (json) {
    if (json === null || json === true || json === false || typeof json === "number" || typeof json === "string")
      return json;
    if (json.u)
      return void 0;
    if (json.hostname && json.port && json.token)
      return new Proxy(json, traps);
    throw new Error("Cannot import: "+JSON.stringify(json));
  };

  var reflects = {
    "getPrototype": 
    "setPrototype": 
    "apply": (tgt, ths, args) => {
      return Reflect.apply(tgt, ths, args)
    }
  }; 

  var traps = {};


  server.on("request", function (req, res) {
    var body = "";
    req.on("data", (data) => body += data);
    req.on("end", () => {
      var parts = parse(req.url);
      var target = map(parts.token);
      var arguments = JSON.parse(body).map(import);
      arguments.unshift(target);
      try {
        var result = [true, export(Reflect[parts.operation].apply(null, arguments)])];
      } catch (error) {
        var result = [false, export(error)];
      }
      res.end(JSON.stringify(result));
    });
  });
  return {
    close: function () {
      server.close();
      map = error;
    },
    import: (url) => {
      
    },
    export: (object) => {
      if (!map.has(object))
        map.set(object, (++counter).toString(36));
      return map.get(object);
    },
    remove: (object) => map.delete(object)
  };
};




module.exports = function () {
  var connections = {};

  return function (con, alias) {
    connections[alias] = con;
  };

};


exports.export = function (con, object) {
  con.on("message", function (message) {
    var data = JSON.parse(message);
    Reflect.apply();
  });
};

exports.import = function (con) {
  return new Proxy({connection:con}, traps);
};
