const fs = require('fs-extra')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path')
const {
    resolveArwenPath
} = require('../utils')

// DEBUG:
// console.log(path.resolve(resolveArwenPath(), 'node_modules', '@babel/preset-env'));

module.exports = {
    entry: path.resolve(process.cwd(), 'src', 'main.js'),
    output: {
        path: path.resolve(process.cwd(), 'dist'),
        filename: '[name].js',
        publicPath: '/'
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                presets: [path.resolve(resolveArwenPath(), 'node_modules', '@babel/preset-env')]
            }
        }, {
            test: /\.scss$/,
            use: ['vue-style-loader', 'css-loader', 'sass-loader']
        }, {
            test: /\.less$/,
            use: ['vue-style-loader', 'css-loader', 'less-loader']
        }]
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        modules: [path.resolve(resolveArwenPath(), 'node_modules'), "node_modules"],
        alias: {
            'vue$': "vue/dist/vue.esm",
            "@": "src"
        }
    },
    resolveLoader: {
        modules: [path.resolve(resolveArwenPath(), 'node_modules'), "node_modules"]
    },
    plugins: [new VueLoaderPlugin()]
}
