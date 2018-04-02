const Fs = require("fs");
const SandboxScenario = require("sandbox-scenario");

const bundle = (analysis, dirname, filenames) => SandboxScenario(
  {type:"browserify", path:__dirname+"/spawn.js"},
  [{type:"browserify", path:__dirname+"/deploy.js"}],
  [{type:"browserify", path:__dirname+"/analysis/"+analysis+".js"}].concat(
    filenames.map((filename) => ({type:"raw", path:__dirname+"/target/"+dirname+"/"+filename+".js"}))),
  (error, script) => {
      if (error)
    throw error;
    Fs.writeFileSync(__dirname+"/output/"+analysis+"-"+dirname+".html", [
      "<!DOCTYPE html>",
      "<html>",
      "  <head>",
      "    <title>sandbox-scenario demo</title>",
      "  </head>",
      "  <body>",
      "    <script type=\"text/javascript\">",
      script.replace(/<\/script>/g, "<\\/script>"),
      "    </script>",
      "  </body>",
      "</html>"
    ].join("\n"), "utf8");
  });

bundle("concolic", "delta", ["server", "client"]);
// bundle("concolic", "sample", ["main"]);