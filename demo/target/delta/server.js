function solve (coefs) {
  const delta = coefs.b * coefs.b - 4 * coefs.a * coefs.c;
  if (delta < 0)
    return [];
  if (delta === 0)
    return [(-coefs.b) / (2 * coefs.a)];
  return [
    (-coefs.b - Math.sqrt(delta)) / (2 * coefs.a),
    (-coefs.b + Math.sqrt(delta)) / (2 * coefs.a)
  ];
}
process.on("message", (message) => {
  process.send(JSON.stringify(solve(JSON.parse(message))));
});