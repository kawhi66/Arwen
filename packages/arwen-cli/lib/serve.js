const path = require('path')
const fs = require('fs-extra')

exports.command = 'serve [options]';
exports.describe = 'launch the server for development mode';
exports.builder = {
    port: {
        alias: 'p',
        default: '3000',
        describe: 'set the port',
        type: 'string'
    }
}

exports.handler = function(argv) {
    const arwen_type = fs.readJsonSync('./package.json')["arwen_type"]
    const Service = require(`${arwen_type}-scripts`)

    new Service(argv.port).run('serve')
}
