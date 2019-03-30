const path = require('path')
const openBrowser = require('react-dev-utils/openBrowser')

exports.resolveArwenPath = function() {
    return path.resolve(__dirname, '..', '..', '..')
}

exports.resolveWorkPath = function() {
    return process.cwd()
}

exports.openBrowser = openBrowser
