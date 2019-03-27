const fs = require('fs-extra')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const BabelPluginTransformRuntime = require('@babel/plugin-transform-runtime')
const path = require('path')
const {
    resolveArwenPath,
    resolveWorkPath
} = require('../utils')

// DEBUG:
// console.log(path.resolve(resolveWorkPath(), 'node_modules', "vue/dist/vue.esm"));

module.exports = {
    mode: "development",
    devtool: 'inline-source-map',
    context: process.cwd(),
    entry: path.resolve(process.cwd(), 'src', 'main.js'),
    output: {
        path: path.resolve(process.cwd(), 'dist'),
        filename: '[name].js',
        publicPath: '/'
    },
    module: {
        rules: [{
            test: /\.html$/,
            loader: 'html-loader'
        }, {
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                cwd: resolveArwenPath(),
                presets: ['@babel/preset-env'],
                plugins: ['@babel/transform-runtime', '@babel/syntax-dynamic-import']
            }
        }, {
            test: /\.scss$/,
            use: ['vue-style-loader', 'css-loader', 'sass-loader']
        }, {
            test: /\.less$/,
            use: ['vue-style-loader', 'css-loader', 'less-loader']
        }, {
            test: /\.css$/,
            use: ['vue-style-loader', 'css-loader']
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: path.posix.join('static', 'img/[name].[hash:7].[ext]')
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: path.posix.join('static', 'fonts/[name].[hash:7].[ext]')
            }
        }]
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        modules: [path.resolve(resolveArwenPath(), 'node_modules'), "node_modules"],
        alias: {
            'vue$': path.resolve(process.cwd(), 'node_modules', 'vue/dist/vue.esm'),
            "@": path.resolve(process.cwd(), 'src'),
        }
    },
    resolveLoader: {
        modules: [path.resolve(resolveArwenPath(), 'node_modules'), "node_modules"]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(process.cwd(), 'index.html'),
            inject: true
        }),
        new VueLoaderPlugin()
    ]
}
