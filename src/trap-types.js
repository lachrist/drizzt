
///////////////
// Combiners //
///////////////
exports.arrival = ["boolean", "reference", "boolean", "any", "reference", "number"];
exports.apply = ["any", "any", ["any"], "number"];
exports.invoke = ["any", "any", ["any"], "number"];
exports.construct = ["any", ["any"], "number"];
exports.unary = ["string", "any", "number"];
exports.binary = ["string", "any", "any", "number"];
exports.get = ["any", "any", "number"];
exports.set = ["any", "any", "any", "number"];
exports.delete = ["any", "any", "number"];
exports.object = [[["any", "any"]], "number"];
exports.array = [["any"], "number"];

///////////////
// Modifiers //
///////////////
exports.copy = ["number", "any", "number"];
exports.drop = ["any", "number"];
exports.swap = ["number", "number", "any", "number"];
// Producers //
exports.read = ["string", "any", "number"];
exports.discard = ["string", "boolean", "number"];
exports.load = ["string", "any", "number"];
exports.catch = ["any", "number"];
exports.primitive = ["primitive", "number"];
exports.regexp = ["string", "string", "number"];
exports.function = ["reference", "number"];
// Consumers //
exports.test = ["any", "number"];
exports.save = ["string", "any", "number"];
exports.declare = ["string", "string", "any", "number"];
exports.write = ["string", "any", "number"];
exports.throw = ["any", "number"];
exports.return = ["any", "number"];
exports.eval = ["any", "number"];
exports.completion = ["any", "number"];
exports.success = ["boolean", "boolean", "any", "number"];
exports.failure = ["boolean", "boolean", "any", "number"];

///////////////
// Informers //
///////////////
exports.begin = ["boolean", "boolean", "number"];
exports.end = ["boolean", "boolean", "number"];
exports.try = ["boolean", "boolean", "number"];
exports.finally = ["number"];
exports.block = ["number"];
exports.leave = ["string", "number"];
exports.label = ["string", "boolean", "number"];
exports.break = ["string", "boolean", "number"];
