const path = require('path')

function relativePath(_path) {
    // TODO: need a global environment management
    // return path.resolve(__dirname, '../../../', _path || '') // prod
    return path.resolve(process.cwd(), _path || '') // dev
}

module.exports = {
    dev: {
        // Paths
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {},

        // Various Dev Server settings
        host: '127.0.0.1', // can be overwritten by process.env.ARWEN_ENV.host
        port: 8091, // can be overwritten by process.env.ARWEN_ENV.port, if port is in use, a free one will be determined
        autoOpenBrowser: true, //自动打开浏览器
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

        // https://webpack.js.org/configuration/devtool/#development
        // devtool: 'eval-source-map',
        devtool: '#cheap-module-eval-source-map',

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,

        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false,
    },
    directory: {
        mainDeps: path.resolve(__dirname, '../', 'node_modules'),
        projectDeps: relativePath('node_modules'),
        root: relativePath(),
        src: relativePath('src')
    },
    build: {
        // Template for index.html
        index: relativePath('index.html'),

        // Paths
        assetsRoot: relativePath('build'),
        assetsZipRoot: relativePath(),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',

        productionSourceMap: true,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: '#source-map',

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        // productionGzip: false,
        productionGzip: true,
        productionToZip: true, // 将打包后的文件压缩成.zip
        productionGzipExtensions: ['js', 'css'],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: false
    }
}
