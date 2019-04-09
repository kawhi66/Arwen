const path = require('path')
const useYarn = require('../lib/use.yarn.js')
const {
    chalk,
    fse,
    semver,
    spawn,
    ErrorHandler
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
    useYarn().then(ok => {
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
            return fse.copy(path.join(cwd, 'node_modules', '@arwen/h_ui-scripts', 'template'), cwd)
        }).then(() => {
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
            try {
                fse.remove('./pkgConfig.json')
            } catch (e) {} finally {
                console.log("create ok")
            }
        }).catch(err => {
            if (err.is_arwen) {
                if (err.code === 'UNKNOWN_ERROR') {
                    console.error(
                        '\n' +
                        `   I am sorry, you just trigger an unknown error\n` +
                        `   please report here https://github.com/kawhi66/arwen/issues\n` +
                        `   I will try to deal with it as soon as I can` +
                        '\n'
                    )
                } else {
                    console.error(
                        '\n' +
                        `   ${err.code}\n` +
                        `   ${err.message}` +
                        '\n'
                    )
                }
            } else {
                console.error(err)
            }
        })
    })
}
