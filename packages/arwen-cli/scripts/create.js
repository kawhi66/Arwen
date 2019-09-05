const { chalk, fse: fs, inquirer, ora, spawn } = require("@arwen/arwen-utils");
const install = require("../lib/install.pkg.js");
const path = require("path");

const defaultSpawnConfig = {
  stdio: "ignore"
};

exports.command = ["create <name>", "init"];
exports.description = "generate and initialize a new project based on h_ui template";
exports.builder = function(yargs) {
  return yargs.option({
    name: {
      alias: "n",
      default: "arwen",
      description: "specify the project name",
      type: "string"
    }
  });
};

exports.handler = async function(argv) {
  console.log();

  const projectDir = path.join(process.cwd(), argv.name);
  const step1 = ora(`Initializing the project ${chalk.green(argv.name)}`);
  const step2 = ora(`Installing development dependencies, this is gonna take a while`);
  const step3 = ora("Loading template files");
  const step4 = ora("Installing runtime dependencies, this is gonna take a while");
  const step5 = ora(`Creation succeed\n`);
  let whereami;

  // project directory exists
  if (fs.pathExistsSync(projectDir)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: `The project directory ${chalk.green(argv.name)} has already existed, do you wanna overwrite it, this ${chalk.red("can not")} be undo ?`,
        default: false
      }
    ]);

    if (overwrite) {
      fs.emptyDirSync(projectDir);
    } else {
      ora(`Project ${chalk.green(argv.name)} creation failed. Please try other project names.\n`).fail();
      throw -1;
    }
  } else {
    fs.ensureDirSync(projectDir);
  }

  process.chdir(projectDir); // change working directory

  try {
    // step1
    step1.start();
    whereami = step1;
    fs.writeJsonSync("./package.json", { name: argv.name, version: "0.0.1" }, { spaces: "\t" });
    step1.succeed();

    // step2
    step2.start();
    whereami = step2;
    if (process.env.ARWEN_ENV === "development") {
      await new Promise(function(resolve, reject) {
        const child = spawn("yarn", ["link", "@arwen/h_ui-scripts"], defaultSpawnConfig);
        child.on("error", reject);
        child.on("close", function(code, signal) {
          if (code !== 0) return reject(`${code} ${signal}`);
          resolve();
        });
      });
    } else {
      await install("@arwen/h_ui-scripts", true);
    }
    step2.succeed("Installing development dependencies");

    // step3
    step3.start();
    whereami = step3;
    fs.copySync(path.join(projectDir, "node_modules", "@arwen/h_ui-scripts", "template"), projectDir);
    step3.succeed();

    // step4
    step4.start();
    whereami = step4;
    const { arwen, dependencies } = fs.readJsonSync("./pkgConfig.json");
    arwen && fs.writeJsonSync("./package.json", Object.assign(fs.readJsonSync("./package.json"), { arwen }), { spaces: "\t" });
    dependencies && (await install(Object.keys(dependencies).map(key => `${key}@${dependencies[key]}`))); // WARNING: pkgConfig's dependencies should have explicit version, not version range
    step4.succeed("Installing runtime dependencies");

    // step5
    step5.start();
    whereami = step5;
    fs.removeSync("./pkgConfig.json");
    step5.succeed();
  } catch (error) {
    whereami.fail();

    console.log();
    err && console.error(error);
  }
};
