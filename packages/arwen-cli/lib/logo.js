const path = require("path");
const { chalk, fs } = require("@arwen/arwen-utils");

const version = fs.readJsonSync(path.resolve(__dirname, "../package.json")).version;
const arwen = `
      __ _ _ ____      _____ _ __
     / _\` | '__\\ \\ /\\ / / _ \\ '_ \\
    | (_| | |   \\ \V  \V /  __/ | | |
     \\__,_|_|    \\_/\\_/ \\___|_| |_|
                                        CLI ${chalk.green(version)}
`;

module.exports = arwen;
