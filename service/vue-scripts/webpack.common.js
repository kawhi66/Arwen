const path = require('path');
const fs = require('fs-extra');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const babelOptions = {
    presets: [
        require('babel-preset-env'),
        require('babel-preset-stage-0'),
    ],
    plugins: [
        // require('babel-plugin-transform-runtime'),
        require('babel-plugin-syntax-dynamic-import'),
        require("babel-plugin-transform-class-properties"),
    ],
    compact: 'auto',
    //73460 light工程中lib目录中存在node_modules目录中的ethjs-util模块时编译不报错,打包报错的问题处理
    babelrc: false,
    //94259 lighting中编译支持缓存，提高编译效率
    // cacheDirectory:require("path").join(require("os").tmpdir(),'LIGHTING_WEBPACK_CACHE')
};

function resolvePath(route) {
    return path.resolve(process.cwd(), route)
}

module.exports = {
    entry: {
        app: [
            resolvePath('./src/view/view.autogeneration.js'),
            resolvePath('./src/app.js'),
        ]
    },
    output: {
        path: resolvePath('./build'),
        filename: '[name].js',
        publicPath: '/'
    },
    module: {
        rules: [{
                test: /\.(less|css)$/,
                loader: 'style-loader!css-loader!less-loader' // 这里会报 can't find module less
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: babelOptions

            },
            {
                test: /\.(png|jpg|gif|svg|ttf|woff|eot)$/,
                loader: 'file-loader',
                options: {
                    name: 'assets/[name].[ext]?[hash]'
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    // esModule: false
                    // loaders: {
                    //     js: "babel-loader?presets=es2015"
                    // }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        modules: [path.resolve(`${__dirname}`, '../../node_modules'), "node_modules"],
        alias: {
            "light": `olight/dist/olight.js`,
            'vue$': "vue/dist/vue.esm",
            "@": "src"
        }
    },
    resolveLoader: {
        modules: [path.resolve(`${__dirname}`, '../../node_modules'), "node_modules"]
    },
    plugins: [
        new CleanWebpackPlugin('build', {
            root: process.cwd()
        }),
        new HtmlWebpackPlugin({
            meta: {
                charset: 'utf-8',
                viewport: 'width=device-width, initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no',
                Keywords: '',
                description: '',
                'apple-mobile-web-app-capable': 'yes',
                'apple-mobile-web-app-status-bar-style': 'black',
                'format-detection': 'telephone=no,email=no'
            },
            templateContent: function () {
                const $ = require("cheerio").load(fs.readFileSync(resolvePath('./public/index.html')));

                $("view").first().replaceWith("<router-view></router-view>");
                $("view").remove();

                return $.html()
            }
        }),
        new VueLoaderPlugin(),
        // new(require("./plugin/loader"))({
        //     babel: babelOptions
        // })
    ]
}