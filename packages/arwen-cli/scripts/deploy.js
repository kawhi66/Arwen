const inquirer = require('inquirer')
const path = require('path')
const pm2 = require('pm2')
const {
    chalk,
    ora,
    ErrorHandler
} = require('@arwen/arwen-utils')

// TODO: deploy command should support remote deploy such as nginx, tomcat, node ...
// TODO: for now, let's just start with local deploy based on express

// WARNING: there are many problems with forever, maybe it's better in cli,
// WARNING: but I need it work well in DaemonMode with nodejs API,
// WARNING: obviously, pm2 beats it

exports.command = ['deploy [path]']
exports.description = 'deply a static directory quickly in local with zero config'
exports.builder = yargs => {
    return yargs
        .options({
            path: {
                description: 'specify a static directory path to deploy',
                type: 'string'
            },
            port: {
                alias: 'p',
                default: '8080',
                description: 'specify a port for the server',
                type: 'string'
            },
            signal: {
                alias: 's',
                default: 'start',
                description: 'specify a signal, valid slgnals include start,list,stop',
                type: 'string'
            },
            'app-id': {
                description: 'specify an app id running in local',
                type: 'string'
            }
        })
}

exports.handler = function(argv) {
    // TODO: not just start, restart, stop, list, log(clean, tail)
    console.log()
    if (argv.signal === 'start') {
        if (argv.path) { // path must be set when start
            pm2.connect(function(err) {
                if (err) {
                    return console.error(err)
                }

                pm2.start(path.resolve(__dirname, '../lib/deploy.local.js'), {
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
                            ora(`Deploy succeed, it is running here ${chalk.green('http://localhost:' + argv.port)}.\n`).succeed()
                            ora(`The app id is ${chalk.green(one.pm2_env.pm_id)}, you may need it to stop later.`).info()
                            ora(`If you need more infomation about apps running locally, try ${chalk.green('arwen deploy -s list')}.\n`).info()
                        }
                    }
                })
            })
        } else {
            ora(`For now, arwen only support local deployment. Please specify an explicit path like ${chalk.green('arwen deploy --path ./build')}.\n`).fail()
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
                            created_at
                        }
                    })

                    console.table(appInfos)
                } else {
                    ora(`There are not apps deployed locally. If you need help, try ${chalk.green('arwen deploy --help')}.\n`).info()
                }
            })
        })
    } else if (argv.signal === 'stop') {
        pm2.connect(function(err) {
            if (err) {
                return console.error(err)
            }

            if (argv.appId) {
                pm2.stop(argv.appId, function(err, proc) {
                    if (err) {
                        console.error(err)
                        pm2.disconnect()
                        return false
                    }

                    pm2.delete(argv.appId, function(err, proc) {
                        pm2.disconnect()

                        if (err) {
                            return console.error(err)
                        }

                        ora('Stop succeed.\n').succeed()
                    })
                })
            } else {
                ora('Specifying an explicit app id is highly recommended, if not, all apps running locally will be destroyed.').warn()
                inquirer.prompt([{
                    type: 'confirm',
                    name: 'stopAll',
                    message: `Sure you wanna do this ?`,
                    default: false
                }]).then(answers => {
                    if (answers.stopAll) {
                        pm2.stop('all', function(err, proc) {
                            pm2.delete('all', function(err, proc) {
                                pm2.disconnect()
                                ora('Stop succeed.\n').succeed()
                            })
                        })
                    } else {
                        pm2.disconnect()
                        ora(`If you have trouble getting app id, running ${chalk.green('arwen deploy -s list')} to get more detail infomation.\n`).info()
                    }
                })
            }
        })
    } else {
        const err = new ErrorHandler('INVALID_DEPLOY_SIGNAL')
        console.error(
            '\n' +
            `   ${err.code}\n` +
            `   ${err.message}` +
            '\n'
        )
    }
}
