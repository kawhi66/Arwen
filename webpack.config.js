const webpack = require('webpack');
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
    entry: './src/app.js',
    output: {
        path: require('path').resolve('build'),
        chunkFilename: '[name].js?[chunkhash]',
        filename: '[name].js'
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
                    postcss: [
                        require('autoprefixer')({
                            browsers: ['> 0.1%', 'ios >= 8', 'not ie < 12']
                        })
                    ]
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
            "@": "src"
        }
    },
    resolveLoader: {
        modules: [`${__dirname}/node_modules`, "lib/node_modules", "lib", "node_modules"]
    },
    plugins: [
        new require('progress-bar-webpack-plugin')({
            format: '  编译中 [:bar] ' + require("chalk").green.bold(':percent') + ' (:elapsed 秒)',
            clear: false
        }),
        new(require("./plugin/loader"))({
            babel: babelOptions
        }),
        new webpack.HotModuleReplacementPlugin({
            multiStep: false,
        }),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    devtool: 'source-map',
    mode: 'development'
}