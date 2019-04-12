const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const notifier = require('node-notifier')
const webpack = require('webpack')
const createWebpackConfig = require('./config/webpack.config')
const webpackDevServer = require('webpack-dev-server')
const webpackDevServerConfig = require('./config/webpackDevServer.config')
const archiver = require('archiver')
const portfinder = require('portfinder')

const {
    chalk,
    fse,
    openBrowser,
    ora,
    ErrorHandler
} = require('@arwen/arwen-utils')

module.exports = class Service {
    constructor(argv) {
        process.ARWEN_ENV = argv
        this.arwen_env = argv
    }

    run(task) {
        if (task === 'serve') {
            this.serve()
        } else if (task === 'build') {
            this.build()
        }
    }

    serve() {
        const webpackConfig = createWebpackConfig('development')
        const host = this.arwen_env.host
        const launch = ora('The development server is launching, browser should be open automatically')

        // find an available port
        portfinder.basePort = this.arwen_env.port
        portfinder.getPort((err, port) => {
            if (err) {
                return new ErrorHandler('INVALID_PORT')
            }

            webpackConfig.plugins.push(new FriendlyErrorsWebpackPlugin({
                compilationSuccessInfo: {
                    messages: [`Your application is running here: http://${host}:${port}`],
                    notes: [`The development build is not optimized. To create a production build, run ${chalk.green('arwen build')}`]
                },
                onErrors: function(severity, errors) {
                    // You can listen to errors transformed and prioritized by the plugin
                    // severity can be 'error' or 'warning'

                    // if (errors.length) {
                    //     notifier.notify({
                    //         title: 'compiler error',
                    //         message: `${severity}: ${errors[0]['name']}`,
                    //         subtitle: errors[0]['file'] || '',
                    //         // icon: ICON
                    //     })
                    // }
                }
            }))

            const compiler = webpack(webpackConfig) // create compiler instance
            const server = new webpackDevServer(compiler, webpackDevServerConfig) // create development server
            server.listen(port, host, function() {
                launch.info()
                openBrowser(`http://${host}:${port}`)
            })
        })
    }

    build() {
        const arwen_env = this.arwen_env
        const webpackConfig = createWebpackConfig('production')
        const build = ora('Building for production, this is gonna take a while')
        const pack = ora('Compressing into a zip file')
        const cb = function(err, stats) {
            if (err) {
                build.fail('Build fail')

                console.error()
                console.error(err.stack || err)
                err.details && console.error(err.details)

                return false
            }

            if (stats.hasErrors()) {
                build.fail('Build fail')

                console.error()
                stats.toJson().errors.map(function(error) {
                    console.error(error)
                })

                return false
            }

            build.succeed('Build succeed')

            if (arwen_env.pack) {
                let packageName

                if (arwen_env.packageName) {
                    packageName = arwen_env.packageName
                } else {
                    packageName = fse.readJsonSync('./package.json').name
                }

                pack.start()
                const output = fse.createWriteStream(`./${packageName}.${new Date().getTime()}.zip`)
                const archive = archiver('zip', {
                    zlib: {
                        level: 9
                    } // Sets the compression level.
                })

                // listen for all archive data to be written
                // 'close' event is fired only when a file descriptor is involved
                output.on('close', function() {
                    pack.succeed('Pack succeed')
                })

                // good practice to catch this error explicitly
                archive.on('error', function(err) {
                    pack.fail('Pack fail')
                    console.error()
                    console.error(err.stack || err)
                    err.details && console.error(err.details)
                })

                // pipe archive data to the file
                archive.pipe(output)

                // append files from a sub-directory and naming it `new-subdir` within the archive
                archive.directory('build/', packageName);

                // finalize the archive (ie we are done appending files but streams have to finish yet)
                // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
                archive.finalize()
            }
        }

        build.start()
        webpack(webpackConfig).run(cb)
    }
}
