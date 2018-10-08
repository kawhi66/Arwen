const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');

exports.command = 'create [name] [options]';
exports.describe = 'generate the project based on template';
exports.builder = {
    name: {
        alias: 'n',
        default: 'arwen',
        describe: 'specify the project name of generate',
        type: 'string'
    },
    type: {
        alias: 't',
        default: 'vue',
        describe: 'specify the project type of generate',
        type: 'string'
    }
};
exports.handler = function (argv) {
    if (require('./lib/supported').supported.indexOf(argv.type) < 0) {
        shell.echo(`${argv.type} is now not supported! try concat https://kawhi.site`);
        shell.exit(1);
    };

    const src = path.resolve(__dirname, '..', 'template', argv.type);
    const dest = path.join(process.cwd(), argv.name);

    fs.copy(src, dest, {
        overwrite: false,
        errorOnExist: true
    }).then(() => {
        // shell.echo('copy success!');
        process.chdir(dest); // change working directory

        /* ------------------------------------------------------ package.json ------------------------------------------------------ */
        shell.echo('start initialize with a package.json...');
        if (!shell.which('npm')) {
            shell.echo('seriously, you wanna do this without node installed!');
            shell.exit(1);
        }
        shell.exec('npm init -y', {
            silent: true
        });

        /* 写入 ARWEN_TYPE */
        let packagejson = require(path.resolve(process.cwd(), 'package.json'));
        packagejson.ARWEN_TYPE = argv.type;
        fs.writeFileSync(path.resolve(process.cwd(), 'package.json'), JSON.stringify(packagejson, null, 2));
        shell.echo('package.json initialized!\n');
        /* ------------------------------------------------------ package.json ------------------------------------------------------ */

        /* ------------------------------------------------------- .gitignore ------------------------------------------------------- */
        shell.echo('start initialize with a .gitignore...');
        // shell.touch('.gitignore');
        fs.writeFileSync(path.resolve(process.cwd(), '.gitignore'), `
# See https://help.github.com/ignore-files/ for more about ignoring files.

# dependencies
/node_modules

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
`);
        shell.echo('.gitignore initialized!\n');
        /* ------------------------------------------------------- .gitignore ------------------------------------------------------- */

        shell.echo('create success!');
    }).catch(err => {
        throw err;
        // shell.echo(`The Destination path '${dest}' already existed, try delete or rename it and do this again`);
        // shell.exit(1);
    })
}