const chalk = require('@arwen/arwen-utils').chalk
const fs = require('@arwen/arwen-utils').fse
const path = require('path')
const pm2 = require('pm2')

module.exports = localDeploy

function localDeploy(localPath, localPort) {
    return new Promise(function(resolve, reject) {
        if (!localPath) return reject(`${chalk.red("Missing required path")}`)
        if (!fs.pathExistsSync(localPath)) return reject(`${chalk.red("Path not found in local")}`)

        pm2.connect(function(err) {
            if (err) return reject(err)

            pm2.start(path.resolve(__dirname, './serve.local.js'), {
                name: localPath || '',
                env: {
                    ARWEN_DEPLOY_PATH: localPath,
                    ARWEN_DEPLOY_PORT: localPort
                }
            }, function(err, apps) {
                pm2.disconnect()
                if (err) return reject(err)

                resolve(apps.find(function(app) {
                    return app.pm2_env.ARWEN_DEPLOY_PATH === localPath && app.pm2_env.ARWEN_DEPLOY_PORT === localPort
                }))
            })
        })
    })
}
