const verifyPkgConfig = require("../lib/verify.pkg");
const requireRelative = require("../lib/require.relative");

exports.command = ["build", "release"];
exports.description = "compile and optimized build in production mode";
exports.builder = function(yargs) {
  return yargs
    .option("debug", {
      default: false,
      description: "switch on the source map in production",
      type: "boolean"
    })
    .option("zip", {
      default: false,
      description: "pack files in build directory into a zip file",
      type: "boolean"
    })
    .option("package-name", {
      description: "specify package name for zip file",
      type: "string"
    });
};

exports.handler = async function(argv) {
  try {
    await verifyPkgConfig(argv);
    const Service = requireRelative(`@arwen/${argv.type}-scripts`);
    new Service(argv).run("build");
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
