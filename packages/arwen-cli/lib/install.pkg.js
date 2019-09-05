const { chalk, spawn } = require("@arwen/arwen-utils");

const registry = "http://registry.npm.taobao.org";
const sass_binary_site = "https://cdn.npm.taobao.org/dist/node-sass"; // use cnpm binary for node-sass
const defaultSpawnConfig = {
  stdio: "ignore"
};

module.exports = install;

function install(packages, isDev) {
  return new Promise(function(resolve, reject) {
    if (!packages || packages.length <= 0) return reject("empty packages");
    if (typeof packages == "string") {
      packages = [packages];
    }

    process.env.SASS_BINARY_SITE = sass_binary_site;

    const child = spawn("npm", ["install", "--registry", registry].concat(isDev ? ["--save-dev"] : []).concat(packages), defaultSpawnConfig);
    child.on("error", reject);
    child.on("close", function(code, signal) {
      if (code !== 0)
        return reject(
          `Sorry, you just triggered an unknown error, ${chalk.red("the exit code is " + code + ", the signal is " + signal)}, please report this to ${chalk.cyan(
            "https://github.com/kawhi66/arwen/issues"
          )}, I will try to fix it ASAP.`
        );
      resolve();
    });
  });
}

// function isManagerAvailable(manager) {
//   return new Promise(function(resolve) {
//     const child = spawn(manager, ["--version"], defaultSpawnConfig);

//     child.on("close", function(code) {
//       if (code == 0) {
//         return resolve(true);
//       } else {
//         return resolve(false);
//       }
//     });

//     child.on("error", function(err) {
//       return resolve(false);
//     });
//   });
// }
