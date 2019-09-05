const verifyPkgConfig = require("../lib/verify.pkg");
const requireRelative = require("../lib/require.relative");

exports.command = ["serve", "start", "dev"];
exports.description = "launch a server and serve the project in development mode";
exports.builder = function(yargs) {
  return yargs
    .option("host", {
      alias: "h",
      default: "localhost",
      description: "specify a host for the server",
      type: "string"
    })
    .option("port", {
      alias: "p",
      default: "3000",
      description: "specify a port for the server",
      type: "string"
    });
};

exports.handler = function(argv) {
  try {
    verifyPkgConfig(argv);
    const Service = requireRelative(`@arwen/${argv.type}-scripts`);
    new Service(argv).run("serve");
  } catch (error) {
    if (error.is_arwen) {
      if (error.code === "UNKNOWN_ERROR") {
        console.error("\n" + `   I am sorry, you just trigger an unknown error\n` + `   please report here https://github.com/kawhi66/arwen/issues\n` + `   I will try to deal with it as soon as I can` + "\n");
      } else {
        console.error("\n" + `   ${error.code}\n` + `   ${error.message}` + "\n");
      }
    } else {
      console.error(error);
    }
  }
};
