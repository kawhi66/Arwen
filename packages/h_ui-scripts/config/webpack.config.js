const CleanWebpackPlugin = require('clean-webpack-plugin')
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
        const assetsSubDirectory = isProdCompile ?
            envConfig.build.assetsSubDirectory : isDevCompile && envConfig.dev.assetsSubDirectory

        return path.posix.join(assetsSubDirectory, _path)
    }

    return {
        mode: "development",
        context: envConfig.directory.root,
        entry: {
            // sysconfig: path.resolve(envConfig.directory.root, 'sysconfig.js'), // TODO: add hash value
            main: path.resolve(envConfig.directory.src, 'main.js')
        },
        output: {
            path: envConfig.build.assetsRoot,
            filename: assetsPath('js/[name].[chunkhash].js'),
            chunkFilename: assetsPath('js/[id].[chunkhash].js'),
            publicPath: envConfig.dev.assetsPublicPath
        },
        devtool: envConfig.dev.devtool,
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
                        cwd: envConfig.directory.mainDeps,
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/transform-runtime', '@babel/syntax-dynamic-import']
                    }
                }],
                exclude: [/node_modules/, /^sysconfig/]
            }, {
                test: /\.scss$/,
                use: [isProdCompile ? MiniCssExtractPlugin.loader : isDevCompile && 'vue-style-loader', 'css-loader', 'sass-loader']
            }, {
                test: /\.less$/,
                use: [isProdCompile ? MiniCssExtractPlugin.loader : isDevCompile && 'vue-style-loader', 'css-loader', 'less-loader']
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
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash:7].[ext]',
                        outputPath: assetsPath('images')
                    }
                }]

            }, {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash:7].[ext]',
                        outputPath: assetsPath('fonts')
                    }
                }]
            }]
        },
        resolve: {
            extensions: ['.js', '.vue', '.json'],
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
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: envConfig.build.index,
                inject: true
            }),
            new VueLoaderPlugin()
        ].concat(isProdCompile ? [new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: assetsPath("css/[name].[contenthash].css"),
            chunkFilename: assetsPath("css/[id].[contenthash].css")
        }), new CopyWebpackPlugin([{
            from: path.resolve(envConfig.directory.root, 'sysconfig.js'),
            to: path.resolve(envConfig.build.assetsRoot, 'sysconfig.js')
        }])] : isDevCompile && [])
    }
}
