const fse = require('@arwen/arwen-utils').fse
const path = require('path')
const spawn = require('@arwen/arwen-utils').spawn
const binPath = path.resolve(__dirname, '../', 'packages/arwen-cli/bin/arwen')
const testDirPath = path.normalize('/Users/kawhi/Desktop/Projects/tryarwen')
const testProject = 'h_ui-demo'

process.chdir(testDirPath)
fse.emptyDirSync(path.resolve(testDirPath, testProject))

const child = spawn('node', [binPath, 'create', testProject], {
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
