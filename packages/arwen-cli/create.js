const path = require('path')
const fs = require('fs-extra')
const spawn = require('cross-spawn')

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

exports.handler = function(argv) {
    /**
     * @description run create tasks
     * @event 1. make directory as ${argv.name}
     * @event 2. init a package.json as ${argv.type}, install the core dependency ${argv.type}-scripts
     * @event 3. copy the template from ${argv.type}-scripts
     * @event 4. merge package.json with template package.json, install packages
     * @todo arwen-utils add function mergePkgConfig
     * @todo friendly creation
     */
    const cwd = path.join(process.cwd(), argv.name)
    const core = `${argv.type}-scripts`
    return console.log(argv)

    fs.ensureDir(cwd).then(() => {
        process.chdir(cwd) // change work directory
        return fs.copy(path.join(cwd, 'node_modules', core, 'template'), cwd) // copy template
    }).then(() => {
        const {
            dependencies
        } = fs.readJsonSync('./package.json')

        return fs.writeJson('./package.json', {
            name: argv.name,
            version: "1.0.0",
            dependencies: {
                // "arwen-utils": "^1.0.0",
                // [core]: "^1.0.0"
                ...dependencies
            },
            arwen: {
                type: argv.type // identify arwen project
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
        console.log("create ok")
    }).catch(err => {
        console.error('[error]: ', require('util').inspect(err))
    })
}
