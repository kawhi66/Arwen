const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');

exports.command = 'build';
exports.describe = 'compile and build';
exports.builder = {};
exports.handler = function (argv) {
    fs.pathExists(path.resolve(process.cwd(), './package.json')).then(function (exists) {
        if (!exists) {
            console.log('um...please do this in an arwen project directory!');
            return shell.exit(1);
        };

        process.env.ARWEN_ENV = 'production';
        process.env.ARWEN_TYPE = require(path.resolve(process.cwd(), './package.json')).ARWEN_TYPE;
        require('./lib/release');
    });
}