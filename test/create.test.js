const bin = require('./config.test.js').bin
const fse = require('@arwen/arwen-utils').fse
const path = require('path')
const spawn = require('@arwen/arwen-utils').spawn
const testDir = require('./config.test.js').testDir
const testProject = require('./config.test.js').testProject

process.chdir(testDir)
process.env.ARWEN_ENV = 'development'

const child = spawn('node', [bin, 'create', testProject], {
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
