const pm2 = require('pm2')

module.exports = localStop

function localStop(appId) {
    return new Promise(function(resolve, reject) {
        pm2.connect(function(err) {
            if (err) return reject(err)

            if (appId) {
                pm2.stop(appId, function(err, proc) {
                    if (err) {
                        pm2.disconnect()
                        return reject(err)
                    }

                    pm2.delete(appId, function(err, proc) {
                        pm2.disconnect()
                        if (err) return reject(err)

                        resolve()
                    })
                })
            } else {
                pm2.stop('all', function(err, proc) {
                    if (err) {
                        pm2.disconnect()
                        return reject(err)
                    }

                    pm2.delete('all', function(err, proc) {
                        pm2.disconnect()
                        if (err) return reject(err)

                        resolve()
                    })
                })
            }
        })
    })
}
