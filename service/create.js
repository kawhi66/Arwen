const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');

exports.command = 'create [name] [options]';
exports.describe = 'generation';
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
    const src = path.resolve(__dirname, '..', 'template', argv.type);
    const dest = path.join(process.cwd(), argv.name)

    fs.copy(src, dest, {
        overwrite: false,
        errorOnExist: true
    }).then(() => {
        shell.echo('copy success!');
        process.chdir(dest); // change working directory

        shell.echo('start initialize with a package.json!');
        if (!shell.which('npm')) {
            shell.echo('seriously, you wanna do this without node installed!');
            shell.exit(1);
        }
        shell.exec('npm init -y');
        shell.touch('.gitignore');
        shell.echo('create success!');
    }).catch(err => {
        shell.echo(`The Destination path '${dest}' already existed, try delete or rename it and do this again`);
        shell.exit(1);
    })
}