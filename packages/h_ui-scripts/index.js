const webpack = require('webpack')
const createWebpackConfig = require('./config/webpack.config')
const webpackDevServer = require('webpack-dev-server')
const webpackDevServerConfig = require('./config/webpackDevServer.config')

const {
    openBrowser,
    ErrorHandler
} = require('@arwen/arwen-utils')

module.exports = class Service {
    constructor(argv) {
        this.arwen_env = argv
        process.env.ARWEN_ENV = argv
    }

    /**
     * @description run the task registered in the lib
     * @param {String} task name
     */
    run(task) {
        if (task === 'serve') {
            this.serve()
        } else if (task === 'build') {
            this.build()
        } else {
            throw new ErrorHandler('INVALID_ARWEN_TASK')
        }
    }

    serve() {
        const webpackConfig = createWebpackConfig('development')
        const compiler = webpack(webpackConfig) // create compiler instance
        const server = new webpackDevServer(compiler, webpackDevServerConfig) // create server
        const {
            host,
            port
        } = this.arwen_env

        server.listen(port, host, function() {
            openBrowser(`http://${host}:${port}`)
        })
    }

    build() {
        const webpackConfig = createWebpackConfig('production')
        const cb = function(err, stats) {
            if (err) {
                console.error(err.stack || err)
                err.details && console.error(err.details)

                return false
            }

            const info = stats.toJson()

            if (stats.hasErrors()) {
                return console.error(info.errors)
            }

            if (stats.hasWarnings()) {
                return console.error(info.warnings)
            }

            console.log('  Build complete.\n')
            console.log(
                '  Tip: built files are meant to be served over an HTTP server.\n' +
                '  Opening index.html over file:// won\'t work.\n'
            )
        }

        webpack(webpackConfig).run(cb)
    }
}
