
// 

module.exports = function (con) {

};

module.exports = function (con) {
  var wesh = Events();
  var counter = 0;
  var callbacks = [];
  var weakmap = new WeakMap();
  var traps = {
    getPrototype = 
  };
  con.on("message", function (data) {
    if (data[0] === "v")
      return wesh.emit("value", JSON.parse(data.substring(1)));
    if (data[0] === "r")
      return wesh.emit("reference", new Proxy({tag:data.substring(1)}, traps));
    else if (data[0] === "?") {
    else if (data[0] === "!")
      var
  });
  wesh.value = function (value) {
    con.send("v"+JSON.stringify(value));
  }
  wesh.reference = function (reference) {
    con.send("r"+JSON.parse(reference);
  };
  return wesh;
} 
