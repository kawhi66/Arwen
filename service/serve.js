const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');

exports.command = 'serve [options]';
exports.describe = 'launch the server for development mode';
exports.builder = {
    port: {
        alias: 'p',
        default: '3000',
        describe: 'set the port',
        type: 'string'
    }
};
exports.handler = function (argv) {
    fs.pathExists(path.resolve(process.cwd(), './package.json')).then(function (exists) {
        if (!exists) {
            console.log('um...please do this in an arwen project directory!');
            return shell.exit(1);
        };

        process.env.ARWEN_ENV = 'development';
        process.env.ARWEN_TYPE = require('./package.json').ARWEN_TYPE;
        process.env.ARWEN_PORT = argv.port;
        require('./lib/release');
    });
}