const path = require('path')
const useYarn = require('../lib/use.yarn.js')
const {
    chalk,
    fse,
    ora,
    spawn
} = require('@arwen/arwen-utils')

exports.command = ['create <name>', 'init']
exports.description = 'generate the project based on template'
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
    const cwd = path.join(process.cwd(), argv.name)
    const step1 = ora(`Initializing the project ${chalk.green(argv.name)}`)
    const step2 = ora(`Installing development dependencies, this is gonna take a while`)
    const step3 = ora('Loading template files')
    const step4 = ora('Installing runtime dependencies')
    const step5 = ora(`Project ${chalk.green(argv.name)} creation successful\n`)
    let whereami = step1

    useYarn().then(ok => {
        step1.start()
        fse.ensureDir(cwd).then(() => {
            process.chdir(cwd)

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
            return fse.copy(path.join(cwd, 'node_modules', '@arwen/h_ui-scripts', 'template'), cwd)
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
}
