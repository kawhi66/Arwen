const verifyPkgConfig = require('../lib/verify.pkg')
const requireRelative = require('../lib/require.relative')

exports.command = ['build', 'release']
exports.description = 'compile and build'
exports.builder = function(yargs) {
    return yargs
        .option('debug', {
            default: false,
            description: 'turn on the source map in production',
            type: 'boolean'
        })
        .option('pack', {
            default: false,
            description: 'to zip file',
            type: 'boolean'
        })
        .option('package-name', {
            description: 'specify zip package name',
            type: 'string'
        })
}

exports.handler = function(argv) {
    verifyPkgConfig(argv)
        .then(function(argv) {
            const Service = requireRelative(`@arwen/${argv.type}-scripts`)
            new Service(argv).run('build')
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
