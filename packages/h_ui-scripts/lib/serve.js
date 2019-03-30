const webpack = require('webpack')
const webpackConfig = require('../config/webpack.config')
const webpackDevServer = require('webpack-dev-server')
const webpackDevServerConfig = require('../config/webpackDevServer.config')
const openBrowser = require('arwen-utils')["openBrowser"]

module.exports = function() {
    const ARWEN_PORT = process.env.ARWEN_PORT
    const compiler = webpack(webpackConfig) // create compiler instance
    const server = new webpackDevServer(compiler, webpackDevServerConfig) // create server

    server.listen(ARWEN_PORT, "localhost", function() {
        openBrowser(`http://localhost:${ARWEN_PORT}`)
    })
}
