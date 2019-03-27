const path = require('path')

module.exports = {
    clientLogLevel: 'warning',
    compress: true,// contentBase: path.resolve(process.cwd(), 'dist'),
    historyApiFallback: true,
    hot: true,
    host: '127.0.0.1',
    port: '8099',
    open: true,
    publicPath: '/'
}
