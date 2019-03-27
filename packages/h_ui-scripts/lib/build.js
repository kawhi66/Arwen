const fs = require('fs-extra')
const path = require('path')
const webpack = require('webpack')
const webpackConfig = require('../config/webpack.config')

module.exports = function() {
    /**
     * https://webpack.js.org/api/node
     * webpack(config, cb) will run the compiler "only" the cb is provided
     * otherwise webpack(config) will "only" return a compiler instance
     * you have to manually call the run method
     * webpack(config).run((cb)
     */
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

    // webpack(webpackConfig, cb)
    webpack(webpackConfig).run(cb)
}
