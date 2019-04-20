const chalk = require('@arwen/arwen-utils').chalk
const path = require('path')
const pm2 = require('pm2')
const tv4 = require('tv4')

module.exports = localDeploy

function localDeploy(config) {
    return new Promise(function(resolve, reject) {
        if (!tv4.validate(config, {
                type: 'object',
                required: ["path", "port"],
                properties: {
                    path: {
                        type: 'string'
                    },
                    port: {
                        type: 'string'
                    }
                }
            })) {
            return reject(`Something wrong with the config, ${chalk.red(tv4.error.message)}`)
        }

        pm2.connect(function(err) {
            if (err) return reject(err)

            pm2.start(path.resolve(__dirname, './serve.local.js'), {
                name: config.path || '',
                env: {
                    ARWEN_DEPLOY_PATH: config.path,
                    ARWEN_DEPLOY_PORT: config.port
                }
            }, function(err, apps) {
                pm2.disconnect()
                if (err) return reject(err)

                resolve(apps.find(function(app) {
                    return app.pm2_env.ARWEN_DEPLOY_PATH === config.path && app.pm2_env.ARWEN_DEPLOY_PORT === config.port
                }))
            })
        })
    })
}
