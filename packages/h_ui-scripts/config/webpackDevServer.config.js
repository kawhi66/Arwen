const {
    dev: {
        assetsPublicPath
    }
} = require('./env.config.js')

module.exports = {
    clientLogLevel: 'warning',
    compress: true,
    // contentBase: false,
    historyApiFallback: true,
    hot: true,
    index: 'index.html',
    open: true,
    overlay: true,
    publicPath: assetsPublicPath,
    quiet: true,
    // stats: 'errors-only',
    watchOptions: {
        poll: true
    }
}
