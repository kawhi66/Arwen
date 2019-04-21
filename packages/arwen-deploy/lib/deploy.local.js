const chalk = require('@arwen/arwen-utils').chalk
const path = require('path')
const pm2 = require('pm2')
const tv4 = require('tv4')

module.exports = localDeploy

function localDeploy(path, port) {
    return new Promise(function(resolve, reject) {
        if (!path) return reject(`${chalk.red("Missing required path")}`)

        pm2.connect(function(err) {
            if (err) return reject(err)

            pm2.start(path.resolve(__dirname, './serve.local.js'), {
                name: path || '',
                env: {
                    ARWEN_DEPLOY_PATH: path,
                    ARWEN_DEPLOY_PORT: port
                }
            }, function(err, apps) {
                pm2.disconnect()
                if (err) return reject(err)

                resolve(apps.find(function(app) {
                    return app.pm2_env.ARWEN_DEPLOY_PATH === path && app.pm2_env.ARWEN_DEPLOY_PORT === port
                }))
            })
        })
    })
}
