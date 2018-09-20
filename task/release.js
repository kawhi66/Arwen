const compiler = require('webpack')(require('../webpack.config'));
const config = {
    noInfo: true,
    log: false
}

require("webpack-dev-middleware")(compiler, config);
require("webpack-hot-middleware")(compiler, config);

module.exports = function () {
    // let config_web = require("./build.web").build();
    // let config_native = require("./build.native").build();

    // return Promise.all([
    //     new Promise(function (resolve) {
    //         if (config_native !== undefined) {
    //             webpack(config_native, function () {
    //                 resolve();
    //             })
    //         } else {
    //             resolve()
    //         }
    //     }),
    //     new Promise(function (resolve) {
    //         if (process.env.NODE_ENV === "dev") {
    //             let compiler = webpack(config_web);
    //             global.middleware = [];

    //             const devModule = require("webpack-dev-middleware")(compiler, {
    //                 noInfo: true, log: false
    //             });
    //             global.middleware.push(devModule);

    //             devModule.waitUntilValid(() => {
    //                 // 开发环境 可能会停在这里
    //                 resolve()
    //             });

    //             global.middleware.push(require("webpack-hot-middleware")(compiler, {
    //                 noInfo: true, log: false
    //             }))
    //         } else {
    //             webpack(config_web, function () {
    //                 resolve();
    //             });
    //         }
    //     })
    // ])
};