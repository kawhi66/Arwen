const path = require('path')

exports.resolveArwenPath = function() {
    return path.resolve(__dirname, '..', '..', '..')
}

exports.resolveWorkPath = function() {
    return process.cwd()
}
