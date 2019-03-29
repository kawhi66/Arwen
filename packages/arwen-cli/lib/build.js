const path = require('path')
const fs = require('fs-extra')

exports.command = 'build'
exports.describe = 'compile and build'
exports.builder = {}
exports.handler = function(argv) {
    const arwen_type = fs.readJsonSync('./package.json')["arwen_type"]
    const Service = require(`${arwen_type}-scripts`)

    new Service(argv.port).run('build')
};
