const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path')
const resolveArwenPath = require('arwen-utils')["resolveArwenPath"]

const core = path.join(process.cwd(), 'node_modules', 'h_ui-scripts')
const core_modules = path.join(core, 'node_modules')
const cwd = process.cwd()

// DEBUG:
// console.log(path.resolve(__dirname, '../node_modules'))

module.exports = {
    mode: "development",
    devtool: 'inline-source-map',
    context: cwd,
    entry: path.join(cwd, 'src', 'main'),
    output: {
        path: path.join(cwd, 'dist'),
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
                cwd: core,
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
        modules: [core_modules, 'node_modules'],
        alias: {
            'vue$': path.resolve(core_modules, 'vue/dist/vue.esm'),
            '@': path.resolve(cwd, 'src')
        }
    },
    resolveLoader: {
        modules: [core_modules, 'node_modules']
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        new VueLoaderPlugin()
    ]
}
