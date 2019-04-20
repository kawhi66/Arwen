const localDeploy = require('./lib/deploy.local')
const localList = require('./lib/list.local')
const localStop = require('./lib/stop.local')
const remoteDeploy = require('./lib/deploy.remote')

module.exports = {
    localDeploy,
    localList,
    localStop,
    remoteDeploy
}
