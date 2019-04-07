const path = require('path')
const pm2 = require('pm2')
const {
    ErrorHandler
} = require('@arwen/arwen-utils')

// TODO: deploy command should support remote deploy such as nginx, tomcat, node ...
// TODO: for now, let's just start with local deploy based on express

// WARNING: there are many problems with forever, maybe it's better in cli,
// WARNING: but I need it work well in DaemonMode with nodejs API,
// WARNING: obviously, pm2 beats it

exports.command = ['deploy [path]']
exports.description = 'local deply'
exports.builder = yargs => {
    return yargs
        .options({
            path: {
                // demandOption: true, // WARNING: not working
                description: 'serve path',
                type: 'string'
            },
            p: {
                alias: 'port',
                default: '8080',
                description: 'specify port',
                type: 'string'
            },
            s: {
                alias: 'signal',
                // choices: ['start', 'list', 'stop'], // WARNING: not working
                default: 'start',
                description: 'specify a signal',
                type: 'string'
            }
        })
}

exports.handler = function(argv) {
    // TODO: not just start, restart, stop, list, log(clean, tail)
    // TODO: how to stop specified process
    if (argv.signal === 'start') {
        // path must be set when start
        if (argv.path) {
            pm2.connect(function(err) {
                if (err) {
                    return console.error(err)
                }

                pm2.start(path.resolve(__dirname, 'lib/deploy.local.js'), {
                    name: argv.path || '',
                    env: {
                        ARWEN_DEPLOY_PATH: argv.path,
                        ARWEN_DEPLOY_PORT: argv.port
                    }
                }, function(err, apps) {
                    pm2.disconnect()

                    if (err) {
                        return console.error(err)
                    }

                    /**
                     * @description Find the matched app, must be useful for better performance
                     * @todo I wanna accurately deal with it, but still got nothing
                     */
                    if (apps.length) {
                        const one = apps.find(function(app) {
                            return app.pm2_env.ARWEN_DEPLOY_PATH === argv.path && app.pm2_env.ARWEN_DEPLOY_PORT === argv.port
                        })

                        if (one) {
                            console.log(
                                '\n' +
                                '   start ok\n' +
                                `   it's running with pid ${one.process.pid}\n`
                            )
                        } else {
                            console.error('start fail, something must be wrong')
                        }
                    }
                })
            })
        } else {
            console.log(
                '\n' +
                '   arwen now just support local deploy\n' +
                '   and you must specify a path like arwen deploy --path ./build\n'
            )
        }
    } else if (argv.signal === 'list') {
        pm2.connect(function(err) {
            if (err) {
                return console.error(err)
            }

            pm2.list(function(err, apps) {
                pm2.disconnect()

                if (err) {
                    return console.error(err)
                }

                if (apps.length) {
                    const appInfos = apps.map(app => {
                        const {
                            name,
                            pid,
                            pm2_env: {
                                ARWEN_DEPLOY_PATH,
                                ARWEN_DEPLOY_PORT,
                                status,
                                created_at
                            }
                        } = app

                        return {
                            name,
                            pid,
                            status,
                            path: ARWEN_DEPLOY_PATH,
                            port: ARWEN_DEPLOY_PORT,
                            status,
                            created_at
                        }
                    })

                    console.table(appInfos)
                } else {
                    console.log('no available app')
                }
            })
        })
    } else if (argv.signal === 'stop') {
        pm2.connect(function(err) {
            if (err) {
                return console.error(err)
            }

            pm2.stop('all', function(err, proc) {
                if (err) {
                    return console.error(err)
                }

                pm2.delete('all', function(err, proc) {
                    pm2.disconnect()

                    if (err) {
                        return console.error(err)
                    }

                    console.log('stop ok')
                })
            })
        })
    } else {
        const err = new ErrorHandler('INVALID_ARWEN_DEPLOY_SIGNAL')
        console.error(`${err.code}: ${err.message}`)
    }
}
