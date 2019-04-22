const pm2 = require('pm2')

module.exports = localList

function localList() {
    return new Promise(function(resolve, reject) {
        pm2.connect(function(err) {
            if (err) return reject(err)

            pm2.list(function(err, apps) {
                pm2.disconnect()
                if (err) return reject(err)

                if (apps.length) {
                    const appInfos = apps.map(app => {
                        const {
                            name,
                            pid,
                            pm2_env: {
                                ARWEN_DEPLOY_PATH,
                                ARWEN_DEPLOY_PORT,
                                pm_id,
                                status,
                                created_at
                            }
                        } = app

                        return {
                            name,
                            id: pm_id,
                            pid,
                            status,
                            path: ARWEN_DEPLOY_PATH,
                            port: ARWEN_DEPLOY_PORT,
                            status,
                            created_at: new Date(created_at)
                        }
                    })

                    resolve(appInfos)
                } else {
                    resolve([])
                }
            })
        })
    })
}
