const path = require('path')
const {
    chalk,
    fse,
    spawn,
    ErrorHandler,
    mergePkgConfig
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

/**
 * @description run create tasks
 * @event 1. make directory as ${argv.name}
 * @event 2. init a package.json as ${argv.type}
 * @event 3. install core dependencies, but for now, let's just link it
 * @event 4. copy the template from ${argv.type}-scripts
 * @event 5. merge package.json with template pkgConfig.json, install packages, remove pkgConfig.json
 * @event 6. install dependencies again, include all dependencies
 * @event 7. create success
 * @todo useYarn or useNpm or useCnpm
 * @todo friendly creation
 */
exports.handler = function(argv) {
    const cwd = path.join(process.cwd(), argv.name)

    fse.ensureDir(cwd).then(() => {
        process.chdir(cwd) // change work directory
        return fse.writeJson('./package.json', {
            name: argv.name,
            version: "0.0.1",
            arwen: {
                type: 'h_ui' // identify arwen project
            }
        }, {
            spaces: '\t'
        })
    }).then(() => {
        return new Promise((resolve, reject) => {
            const child = spawn('yarn', ['link', '@arwen/h_ui-scripts'], {
                stdio: 'inherit'
            }) // dev

            // const child = spawn('yarn', [
            //     'add', '@arwen/h_ui-scripts',
            //     '--dev',
            //     '--registry', 'http://registry.npm.taobao.org'
            // ], {
            //     stdio: 'inherit'
            // }) // prod

            child.on('close', code => {
                if (code !== 0) return reject()
                resolve()
            })
        })
    }).then(() => {
        return fse.copy(path.join(cwd, 'node_modules', '@arwen/h_ui-scripts', 'template'), cwd) // copy template
    }).then(() => {
        return fse.writeJson('./package.json', mergePkgConfig('./package.json', './pkgConfig.json'), {
            spaces: '\t'
        })
    }).then(() => {
        return new Promise((resolve, reject) => {
            fse.readJson('./package.json', function(err, pkgConfig) {
                if (err) {
                    return reject(err)
                }

                // let projectDeps = []
                //
                // for (let i = 0; i < pkgConfig.dependencies.length; i++) {
                //     if (['@arwen/h_ui-scripts', '@arwen/arwen-utils'].includes(pkgConfig.dependencies[i])) {
                //         continue
                //     } else {
                //         projectDeps.push(pkgConfig.dependencies[i])
                //     }
                // }

                const child = spawn('yarn', [
                    // 'add', ...projectDeps,
                    '--registry', 'http://registry.npm.taobao.org'
                ], {
                    stdio: 'inherit'
                })

                child.on('close', code => {
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
}
