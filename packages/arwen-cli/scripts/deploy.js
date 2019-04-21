const chalk = require('@arwen/arwen-utils').chalk
const ora = require('@arwen/arwen-utils').ora
const ErrorHandler = require('@arwen/arwen-utils').ErrorHandler
const deploy = require('@arwen/arwen-deploy').localDeploy
const list = require('@arwen/arwen-deploy').localList
const stop = require('@arwen/arwen-deploy').localStop
const inquirer = require('inquirer')

// WARNING: there are many problems with forever, maybe it's better in cli,
// WARNING: but I need it work well in DaemonMode with nodejs API,
// WARNING: obviously, pm2 beats it

exports.command = ['deploy <path>']
exports.description = 'deply a static directory quickly in local with zero config'
exports.builder = yargs => {
    return yargs
        .options({
            'app-id': {
                description: 'specify an app id running in local',
                type: 'string'
            },
            path: {
                description: 'specify a static directory path to deploy in local',
                type: 'string'
            },
            port: {
                alias: 'p',
                default: '8080',
                description: 'specify a port for the server in local',
                type: 'string'
            },
            signal: {
                alias: 's',
                default: 'start',
                description: 'specify a signal, valid slgnals include start,list,stop',
                type: 'string'
            }
        })
}

exports.handler = function(argv) {
    // TODO: not just start, restart, stop, list, log(clean, tail)
    console.log()
    if (argv.signal === 'start') {
        if (argv.path) { // path must be set when start
            deploy(argv.path, argv.port)
                .then(function(app) {
                    ora(`Deploy succeed, it is running here ${chalk.green('http://localhost:' + argv.port)}.\n`).succeed()
                    ora(`The app id is ${chalk.green(app.pm2_env.pm_id)}, you may need it to stop later.`).info()
                    ora(`If you need more infomation about apps running locally, try ${chalk.green('arwen deploy -s list')}.\n`).info()
                }).catch(function(err) {
                    console.error(err)
                })
        } else {
            ora(`For now, arwen only support local deployment. Please specify an explicit path like ${chalk.green('arwen deploy --path ./build')}.\n`).fail()
        }
    } else if (argv.signal === 'list') {
        list()
            .then(function(apps) {
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
            .catch(function(err) {
                console.error(err)
            })
    } else if (argv.signal === 'stop') {
        if (argv.appId) {
            stop(argv.appId)
                .then(function() {
                    ora('Stop succeed.\n').succeed()
                })
                .catch(function(err) {
                    console.error(err)
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
                    stop()
                        .then(function() {
                            ora('Stop succeed.\n').succeed()
                        })
                        .catch(function(err) {
                            console.error(err)
                        })
                } else {
                    ora(`If you have trouble getting app id, running ${chalk.green('arwen deploy -s list')} to get more detail infomation.\n`).info()
                }
            })
        }
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
