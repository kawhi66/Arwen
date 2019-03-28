const path = require('path')
const fs = require('fs-extra')
const spawn = require('cross-spawn')

exports.command = 'create [name] [options]'
exports.describe = 'generate the project based on template'
exports.builder = {
    name: {
        alias: 'n',
        default: 'arwen',
        describe: 'specify the project name',
        type: 'string'
    },
    type: {
        alias: 't',
        default: 'vue',
        describe: 'specify the project type',
        type: 'string'
    }
}

exports.handler = function(argv) {
    /**
     * @description run create tasks
     * @event 1. make directory as ${argv.name}
     * @event 2. init a package.json as ${argv.type}, install packages
     * @event 3. copy the template from ${argv.type}-scripts
     *
     * @todo how to identify arwen project
     * @todo friendly creation
     */
    const cwd = path.join(process.cwd(), argv.name)
    const core = `${argv.type}-scripts`

    fs.ensureDir(cwd).then(() => {
        process.chdir(cwd) // change work directory

        return fs.writeJson('./package.json', {
            name: argv.name,
            version: "1.0.0",
            dependencies: {
                // "arwen-utils": "^1.0.0",
                // [core]: "^1.0.0"
            }
        }, {
            spaces: '\t'
        })
    }).then(() => {
        return new Promise((resolve, reject) => {
            const child = spawn('yarn', ['link', core], {
                stdio: 'inherit'
            }) // dev

            child.on('close', code => {
                if (code !== 0) return reject()
                resolve()
            })
        })
    }).then(() => {
        return fs.copy(path.join(cwd, 'node_modules', core, 'template'), cwd)
    }).then(() => {
        console.log("create ok")
    }).catch(err => {
        console.error('[error]: ', require('util').inspect(err))
    })
}
