const webpack = require('webpack')
const webpackConfig = require('../config/webpack.config')
const webpackDevServer = require('webpack-dev-server')
const webpackDevServerConfig = require('../config/webpackDevServer.config')
const openBrowser = require('react-dev-utils/openBrowser')

module.exports = function() {
    // create compiler
    const compiler = webpack(webpackConfig)

    // create server
    const server = new webpackDevServer(compiler, webpackDevServerConfig)
    server.listen(8099, "localhost", function() {
        openBrowser("http://localhost:8099")
    });
}
