const inquirer = require('inquirer')
const path = require('path')
const useYarn = require('../lib/use.yarn.js')
const {
    chalk,
    fse,
    ora,
    spawn
} = require('@arwen/arwen-utils')

exports.command = ['create <name>', 'init']
exports.description = 'generate and initialize a new project based on h_ui template'
exports.builder = function(yargs) {
    return yargs
        .option({
            name: {
                alias: 'n',
                default: 'arwen',
                description: 'specify the project name',
                type: 'string'
            }
        })
}

exports.handler = function(argv) {
    console.log()

    const workDir = path.join(process.cwd(), argv.name)
    const step1 = ora(`Initializing the project ${chalk.green(argv.name)}`)
    const step2 = ora(`Installing development dependencies, this is gonna take a while`)
    const step3 = ora('Loading template files')
    const step4 = ora('Installing runtime dependencies')
    const step5 = ora(`Project ${chalk.green(argv.name)} creation succeed\n`)
    let whereami = step1

    fse.pathExists(workDir)
        .then(function(exists) {
            if (exists) {
                return new Promise(function(resolve, reject) {
                    inquirer.prompt([{
                        type: 'confirm',
                        name: 'overwrite',
                        message: `The project directory ${chalk.green(argv.name)} has already existed, do you wanna overwrite it, this ${chalk.red('can not')} be undo ?`,
                        default: false
                    }]).then(answers => {
                        if (answers.overwrite) {
                            console.log()
                            fse.emptyDirSync(workDir)
                            return resolve()
                        } else {
                            ora(`Project ${chalk.green(argv.name)} creation failed. Please try other project names.\n`).fail()
                            return reject()
                        }
                    })
                })
            } else {
                return Promise.resolve()
            }
        })
        .then(useYarn)
        .then(ok => {
            step1.start()
            fse.ensureDir(workDir).then(() => {
                process.chdir(workDir)

                return fse.writeJson('./package.json', {
                    name: argv.name,
                    version: "0.0.1",
                    arwen: {
                        type: 'h_ui'
                    }
                }, {
                    spaces: '\t'
                })
            }).then(() => {
                step1.succeed() && step2.start()
                whereami = step2
                return new Promise((resolve, reject) => {
                    let child

                    if (process.env.ARWEN_ENV === 'development') {
                        child = spawn('yarn', ['link', '@arwen/h_ui-scripts'], {
                            stdio: 'ignore'
                        })
                    } else {
                        child = ok ? spawn('yarn', ['add', '--dev', '@arwen/h_ui-scripts', '--registry', 'http://registry.npm.taobao.org'], {
                            stdio: 'ignore'
                        }) : spawn('npm', ['install', '-d', '--save-dev', '@arwen/h_ui-scripts', '--registry', 'http://registry.npm.taobao.org'], {
                            stdio: 'ignore'
                        })
                    }

                    child.on('error', function(err) {
                        reject(err)
                    })

                    child.on('close', function(code) {
                        if (code !== 0) return reject()
                        resolve()
                    })
                })
            }).then(() => {
                step2.succeed() && step3.start()
                whereami = step3
                return fse.copy(path.join(workDir, 'node_modules', '@arwen/h_ui-scripts', 'template'), workDir)
            }).then(() => {
                step3.succeed() && step4.start()
                whereami = step4
                return new Promise(function(resolve, reject) {
                    fse.readJson('./pkgConfig.json', function(err, pkgConfig) {
                        if (err) {
                            return resolve()
                        }

                        // WARNING: pkgConfig's dependencies should have explicit version, not version range
                        const pkgDeps = Object.keys(pkgConfig.dependencies).map(function(key) {
                            return `${key}@${pkgConfig.dependencies[key]}`
                        })

                        const child = ok ? spawn('yarn', ['add'].concat(pkgDeps).concat(['--registry', 'http://registry.npm.taobao.org']), {
                            stdio: 'ignore'
                        }) : spawn('npm', ['install'].concat(pkgDeps).concat(['--registry', 'http://registry.npm.taobao.org']), {
                            stdio: 'ignore'
                        })

                        child.on('error', function(err) {
                            reject(err)
                        })

                        child.on('close', function(code) {
                            if (code !== 0) return reject()
                            resolve()
                        })
                    })
                })
            }).then(() => {
                step4.succeed()
                try {
                    fse.remove('./pkgConfig.json')
                } catch (e) {} finally {
                    step5.succeed()
                }
            }).catch(err => {
                whereami.fail()

                console.log()
                console.error(err)
            })
        })
        .catch(function(err) {
            err && console.error(err)
        })
}
