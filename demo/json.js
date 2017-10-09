
var Linvail = require("linvail");

module.exports = function (enter, leave) {
  var JSON = global.JSON;
  var counter = 0;
  var prefix = "linvail"+Math.random().toString(36).substring(2)+"/";
  var wrappers = {};
  var disable = true;
  var linvail = Linvail(enter, function (ext, idx, ctx) {
    if (disable)
      return enter(ext, idx, ctx);
    var int = enter(ext, idx, ctx);
    if (int instanceof Boolean || int instanceof Number || int instanceof String)
      int = int.valueOf();
    if (int !== null && typeof int !== "boolean" && typeof int !== "number" && typeof int !== "string")
      return int;
    var id = (++counter).toString(36);
    wrappers[id] = ext;
    return prefix+id+"/"+JSON.stringify(int);
  });
  function loop (data) {
    if (typeof data === "string" && data.indexOf(prefix) === 0) {
      var index = data.indexOf("/");
      var id = data.substring(prefix.length, index);
      if (id in wrappers) {
        var wrapper = wrappers[id];
        delete wrappers[id];
      }
      return JSON.parse(data.substring(index+1));
    }
    if (Array.isArray(data))
      return linvail.array(data.map(loop), null, "JSON.parse");
    if (typeof data === "object" && object !== null) {
      for (var key in data)
        data[key] = loop(data[key]);
      return linvail.object(data, null, "JSON.parse");
    }
    return data;
  }
  return {
    linvail: linvail,
    JSON: {
      stringify: function stringify (arg) {
        disable = false;
        var res = JSON.stringify(val);
        disable = true;
        return res;
      },
      parse: function parse (arg) {
        return loop(JSON.parse(arg));
      }
    }
  };
};
