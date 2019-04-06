const CleanWebpackPlugin = require('clean-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack')
const path = require('path')
const envConfig = require('./env.config.js')

module.exports = function(webpackEnv) {
    const isProdCompile = webpackEnv === 'production'
    const isDevCompile = webpackEnv === 'development'

    const assetsPath = _path => {
        const assetsSubDirectory =
            isProdCompile ?
            envConfig.build.assetsSubDirectory : isDevCompile &&
            envConfig.dev.assetsSubDirectory

        return path.posix.join(assetsSubDirectory, _path || '')
    }

    return {
        mode: isProdCompile ? 'production' : isDevCompile && "development",
        context: envConfig.directory.root,
        entry: function() {
            let entries = [
                path.resolve(envConfig.directory.src, 'main.js')
            ]

            if (isDevCompile) {
                entries.concat([
                    // Include an alternative client for WebpackDevServer. A client's job is to
                    // connect to WebpackDevServer by a socket and get notified about changes.
                    // When you save a file, the client will either apply hot updates (in case
                    // of CSS changes), or refresh the page (in case of JS changes). When you
                    // make a syntax error, this client will display a syntax error overlay.
                    // Note: instead of the default WebpackDevServer client, we use a custom one
                    // to bring better experience for Create React App users. You can replace
                    // the line below with these two lines if you prefer the stock client:
                    require.resolve('webpack-dev-server/client') + '?/',
                    require.resolve('webpack/hot/dev-server')
                ])
            }

            return entries
        },
        output: {
            path: envConfig.build.assetsRoot,
            publicPath: isProdCompile ?
                envConfig.build.assetsPublicPath : isDevCompile &&
                envConfig.dev.assetsPublicPath,
            filename: assetsPath('js/[name].[hash].js'),
            chunkFilename: assetsPath('js/[id].[hash].js')
        },
        devtool: isProdCompile && process.ARWEN_ENV.debug ?
            envConfig.build.devtool : isDevCompile &&
            envConfig.dev.devtool,
        module: {
            rules: [{
                test: /\.html$/,
                use: ['html-loader']
            }, {
                test: /\.vue$/,
                use: ['vue-loader']
            }, {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        cwd: envConfig.directory.mainDeps, // it is installed in the mainDeps
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/transform-runtime', '@babel/syntax-dynamic-import']
                    }
                }],
                exclude: [/node_modules/, /^sysconfig/]
            }, {
                test: /\.scss$/,
                use: [
                    isProdCompile ? MiniCssExtractPlugin.loader : isDevCompile &&
                    'vue-style-loader', 'css-loader', 'sass-loader'
                ]
            }, {
                test: /\.less$/,
                use: [
                    isProdCompile ? MiniCssExtractPlugin.loader : isDevCompile &&
                    'vue-style-loader', 'css-loader', 'less-loader'
                ]
            }, {
                test: /\.css$/,
                use: [{
                    loader: isProdCompile ? MiniCssExtractPlugin.loader : isDevCompile && 'vue-style-loader',
                    options: {
                        // you can specify a publicPath here
                        // by default it use publicPath in webpackOptions.output
                        // publicPath: assetsPath('css')
                    }
                }, 'css-loader']
            }, {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, // why (\?.*)?
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash:7].[ext]',
                        outputPath: assetsPath('images'),
                        publicPath: `/${isProdCompile ?
                            envConfig.build.assetsSubDirectory : isDevCompile &&
                            envConfig.dev.assetsSubDirectory}/images/`
                    }
                }]

            }, {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash:7].[ext]',
                        outputPath: assetsPath('fonts'),
                        publicPath: `/${isProdCompile ?
                            envConfig.build.assetsSubDirectory : isDevCompile &&
                            envConfig.dev.assetsSubDirectory}/fonts/`
                    }
                }]
            }]
        },
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            // make sure projectDeps is top priority
            modules: [envConfig.directory.projectDeps, envConfig.directory.mainDeps],
            alias: {
                'vue$': path.resolve(envConfig.directory.mainDeps, 'vue/dist/vue.esm'),
                '@': envConfig.directory.src
            }
        },
        resolveLoader: {
            modules: [envConfig.directory.mainDeps]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(webpackEnv)
            }),
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin(Object.assign({
                filename: 'index.html',
                template: envConfig.build.index,
                inject: true
            }, isProdCompile ? {
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                }
            } : null)),
            new VueLoaderPlugin(),
            // new webpack.ProgressPlugin((percentage, message, ...args) => {
            //     console.info((percentage * 100).toFixed(0) + '%', message)
            // })
        ].concat(isProdCompile ? [
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: assetsPath("css/[name].[contenthash].css"),
                chunkFilename: assetsPath("css/[id].[contenthash].css")
            }),
            new CopyWebpackPlugin([{
                from: path.resolve(envConfig.directory.root, 'sysconfig.js'),
                to: path.resolve(envConfig.build.assetsRoot, 'sysconfig.js')
            }])
        ] : isDevCompile && [
            // enable HMR
            new webpack.HotModuleReplacementPlugin(),
            // HMR shows correct file names in console on update.
            new webpack.NamedModulesPlugin()
        ]).concat(isProdCompile && envConfig.build.productionGzip ? [
            new CompressionWebpackPlugin({
                test: new RegExp(`\\.(${envConfig.build.productionGzipExtensions.join('|')})$`),
                threshold: 10240
            })
        ] : []),
        node: {
            // prevent webpack from injecting useless setImmediate polyfill because Vue
            // source contains it (although only uses it if it's native).
            setImmediate: false,
            // prevent webpack from injecting mocks to Node native modules
            // that does not make sense for the client
            dgram: 'empty',
            fs: 'empty',
            net: 'empty',
            tls: 'empty',
            child_process: 'empty'
        }
    }
}
