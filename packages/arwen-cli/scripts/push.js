const chalk = require("@arwen/arwen-utils").chalk;
const fs = require("@arwen/arwen-utils").fse;
const ora = require("@arwen/arwen-utils").ora;
const deploy = require("@arwen/arwen-deploy").remoteDeploy;

exports.command = ["push <env>"];
exports.description = "push static files in local to remote environment by ssh";
exports.builder = yargs => {
  return yargs.options({
    env: {
      description: "specify an environment to push",
      type: "string"
    }
  });
};

exports.handler = function(argv) {
  if (!argv.env) return ora(`Please specify an remote environment firstly`).fail();

  const envConfig = fs.readJsonSync("./package.json")["arwen"]["push_env"][argv.env];
  if (!envConfig) return ora(`Remote environment not found`).fail();

  deploy(envConfig)
    .then(function() {
      console.log("Push succeed\n");
    })
    .catch(function(err) {
      console.error(err);
    });
};
