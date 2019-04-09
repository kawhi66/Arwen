const {
    spawn
} = require('@arwen/arwen-utils')

module.exports = function() {
    return new Promise(function(resolve) {
        const child = spawn('yarn', ['--version'], {
            stdio: 'ignore'
        })

        child.on('close', function(code) {
            if (code == 0) {
                return resolve(true)
            } else {
                return resolve(false)
            }
        })

        child.on('error', function(err) {
            return resolve(false)
        })
    })
}
