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
    // list: {
    //     alias: 'l',
    //     describe: 'list all supported build type',
    //     type: 'boolean'
    // },
    type: {
        alias: 't',
        default: 'vue',
        describe: 'specify the project type of generate',
        type: 'string'
    }
};
exports.handler = function (argv) {
    // if (argv.list) {
    //     console.log(`\nsupported template types: \n`);
    //     console.log('   vue: vue project based on the olight frame');
    //     // console.log('   react:  react project based on the react-scripts');
    //     // console.log('   jquery: jquery project based on the zepto');

    //     process.exit(0);
    // };

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