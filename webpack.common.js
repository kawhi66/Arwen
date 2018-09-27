const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
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

module.exports = {
    entry: {
        app: [
            `${__dirname}/src/view/index.js`,
            `${__dirname}/src/app.js`,
        ]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
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
                    loaders: {
                        js: "babel-loader?presets=es2015"
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        modules: [`${__dirname}/node_modules`, "lib/node_modules", "lib", "node_modules"],
        alias: {
            "light": `olight/dist/olight.js`,
            'vue': "vue/dist/vue.esm",
            // 'vue$': 'vue/dist/vue.js',
            "@": "src"
        }
    },
    resolveLoader: {
        modules: [`${__dirname}/node_modules`, "lib/node_modules", "lib", "node_modules"]
    },
    plugins: [
        new CleanWebpackPlugin('build'),
        new HtmlWebpackPlugin({
            templateContent: function () {
                const $ = require("cheerio").load(fs.readFileSync('./public/index.html'));

                $("view").first().replaceWith("<router-view></router-view>");
                $("view").remove();

                return $.html()
            }
        }),
        new VueLoaderPlugin()
    ]
}