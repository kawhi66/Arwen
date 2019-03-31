const path = require('path')
const fs = require('fs-extra')
const spawn = require('cross-spawn')
const {
    ErrorHandler,
    mergePkgConfig
} = require('@arwen/arwen-utils')

exports.command = ['create <name>', 'init']
exports.description = 'generate the project based on template'
exports.builder = {
    name: {
        alias: 'n',
        default: 'arwen',
        description: 'specify the project name',
        type: 'string'
    },
    type: {
        alias: 't',
        default: 'h_ui',
        description: 'specify the project type',
        type: 'string'
    }
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
    const core = `@arwen/${argv.type}-scripts`

    fs.ensureDir(cwd).then(() => {
        process.chdir(cwd) // change work directory
        return fs.writeJson('./package.json', {
            name: argv.name,
            version: "0.0.1",
            dependencies: {
                // "@arwen/arwen-utils": "^1.0.0",
                // [core]: "^1.0.0"
            },
            arwen: {
                type: argv.type // identify arwen project
            }
        }, {
            spaces: '\t'
        })
    }).then(() => {
        return new Promise((resolve, reject) => {
            const child = spawn('yarn', ['link', core, '@arwen/arwen-utils'], {
                stdio: 'inherit'
            }) // should run the install, but for now, let's just link it

            child.on('close', code => {
                if (code !== 0) return reject()
                resolve()
            })
        })
    }).then(() => {
        return fs.copy(path.join(cwd, 'node_modules', core, 'template'), cwd) // copy template
    }).then(() => {
        return fs.writeJson('./package.json', mergePkgConfig('./package.json', './pkgConfig.json'), {
            spaces: '\t'
        })
    }).then(() => {
        return new Promise((resolve, reject) => {
            const child = spawn('yarn', ['--registry', 'http://registry.npm.taobao.org'], {
                stdio: 'inherit'
            })

            child.on('close', code => {
                if (code !== 0) return reject()
                resolve()
            })
        })
    }).then(() => {
        try {
            fs.remove('./pkgConfig.json')
        } catch (e) {} finally {
            console.log("create ok")
        }
    }).catch(err => {
        if (!err.isArwen) {
            err = new ErrorHandler('UNKNOWN_ERROR')
        }
        console.error(`${err.code}: ${err.message}`)
        yargs.exit(1, err)
    })
}
