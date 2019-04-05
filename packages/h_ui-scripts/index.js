const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const notifier = require('node-notifier')
const webpack = require('webpack')
const createWebpackConfig = require('./config/webpack.config')
const webpackDevServer = require('webpack-dev-server')
const webpackDevServerConfig = require('./config/webpackDevServer.config')
const portfinder = require('portfinder')

const {
    openBrowser,
    ErrorHandler
} = require('@arwen/arwen-utils')

module.exports = class Service {
    constructor(argv) {
        process.env.ARWEN_ENV = argv
        this.arwen_env = argv
    }

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
        const host = this.arwen_env.host

        // find an available port
        portfinder.basePort = this.arwen_env.port
        portfinder.getPort((err, port) => {
            if (err) {
                return new ErrorHandler('INVALID_PORT')
            }

            webpackConfig.plugins.push(new FriendlyErrorsWebpackPlugin({
                compilationSuccessInfo: {
                    messages: [
                        `Your application is running here: http://${host}:${port}`
                    ],
                    notes: [
                        'Note that the development build is not optimized',
                        'To create a production build, run arwen build'
                    ]
                },
                onErrors: function(severity, errors) {
                    // You can listen to errors transformed and prioritized by the plugin
                    // severity can be 'error' or 'warning'
                    if (severity !== 'error') {
                        return;
                    }

                    if (errors.length) {
                        notifier.notify({
                            title: 'compiler error',
                            message: `${severity}: ${errors[0]['name']}`,
                            subtitle: errors[0]['file'] || '',
                            // icon: ICON // TODO: need a good icon
                        })
                    }
                }
            }))

            const compiler = webpack(webpackConfig) // create compiler instance
            const server = new webpackDevServer(compiler, webpackDevServerConfig) // create server
            server.listen(port, host, function() {
                console.log('Starting the development server...')
                openBrowser(`http://${host}:${port}`)
            })
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
