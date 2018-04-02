process.on("message", (message) => {
  const sols = JSON.parse(message);
  if (sols.length === 0)
    console.log("No Solution...");
  else if (sols.length === 1)
    console.log("Sol = "+sols[0]);
  else
    console.log("Sol1 = "+sols[0]+", Sol2 = "+sols[1]);
});
process.send(JSON.stringify({a:1, b:6, c:9}));