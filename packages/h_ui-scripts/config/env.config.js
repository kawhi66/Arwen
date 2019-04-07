const path = require('path')

module.exports = {
    directory: {
        // h_ui-scripts's core dependencies
        mainDeps: path.resolve(__dirname, '../', 'node_modules'),
        // h_ui project's custom dependencies, and it should be the top priority
        projectDeps: relativePath('node_modules'),
        root: relativePath(),
        src: relativePath('src')
    },
    dev: {
        // Paths
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',

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
    build: {
        // Template for index.html
        index: relativePath('index.html'),

        // Paths
        assetsRoot: relativePath('build'),
        assetsZipRoot: relativePath(),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',

        // productionSourceMap: false,
        devtool: '#source-map',

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: true,
        productionGzipExtensions: ['js', 'css'],
        // productionToZip: true,

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: false
    }
}

function relativePath(_path) {
    return path.resolve(process.cwd(), _path || '')
}
