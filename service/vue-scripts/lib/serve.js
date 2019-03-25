const webpack = require('webpack')
const webpackConfig = require('../config/webpack.config.js')
const webpackDevServer = require('webpack-dev-server')
const webpackDevServerConfig = require('../config/webpackDevServer.config')

module.exports = function() {
    // create compiler
    const compiler = webpack(webpackConfig)

    // // create server
    const server = new webpackDevServer(compiler, webpackDevServerConfig);
}
