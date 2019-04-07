const verifyPkgConfig = require('../lib/verify.pkg')
const requireRelative = require('../lib/require.relative')

exports.command = ['serve', 'start', 'dev']
exports.description = 'launch the server in development mode'
exports.builder = function(yargs) {
    return yargs
        .option('host', {
            alias: 'h',
            default: 'localhost',
            description: 'specify host',
            type: 'string'
        })
        .option('port', {
            alias: 'p',
            default: '3000',
            description: 'specify port',
            type: 'string'
        })
}

exports.handler = function(argv) {
    verifyPkgConfig(argv)
        .then(function(argv) {
            const Service = requireRelative(`@arwen/${argv.type}-scripts`)
            new Service(argv).run('serve')
        })
        .catch(function(err) {
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
