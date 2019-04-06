const forever = require('forever')
const path = require('path')

// TODO: deploy command should support remote deploy such as nginx, tomcat, node ...
// TODO: for now, let's just start with local deploy based on express

exports.command = ['deploy [path]']
exports.description = 'local deply'
exports.builder = {
    path: {
        default: './build',
        description: 'serve path',
        type: 'string'
    },
    p: {
        alias: 'port',
        default: '8080',
        description: 'specify port',
        type: 'string'
    }
}

exports.handler = function(argv) {
    forever.startDaemon(path.resolve(__dirname, 'lib/deploy.local.js'), {
        env: {
            ARWEN_DEPLOY_PATH: argv.path,
            ARWEN_DEPLOY_PORT: argv.port
        },
        max: 1,
        // silent: true
    })
}
