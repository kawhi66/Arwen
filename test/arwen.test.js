const bin = require('./config.test.js').bin
const spawn = require('@arwen/arwen-utils').spawn
const minimist = require('minimist')
const rawArgs = process.argv.slice(2)
const args = minimist(rawArgs)

const child = spawn('node', [bin].concat(args['_'][0] ? [args['_'][0]] : []).concat(args['help'] ? ['--help'] : []), {
    stdio: 'inherit'
})
child.on('message', function(message) {
    console.log(message)
})
child.on('close', function(code, signal) {
    if (code !== 0) {
        console.error(`exit with code ${code}`)
        console.error(`exit with signal ${signal}`)
    }
})
child.on('error', function(err) {
    err && console.error(err)
})
