const spawn = require('@arwen/arwen-utils').spawn
const minimist = require('minimist')
const rawArgs = process.argv.slice(2)
const args = minimist(rawArgs)

test('arwen', () => {
    return new Promise(function(resolve, reject) {
        const child = spawn('node', [ARWEN], {
            stdio: 'inherit'
        })

        child.on('close', function(code, signal) {
            if (code !== 0) {
                console.error(`exit with code ${code}`)
                console.error(`exit with signal ${signal}`)
                reject(code)
            } else resolve()
        })

        child.on('error', function(err) {
            err && console.error(err)
            reject(err)
        })
    })
})
