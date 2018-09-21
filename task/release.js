// const compiler = require('webpack')(require('../webpack.config'));
// const config = {
//     noInfo: true,
//     log: false
// }

// require("webpack-dev-middleware")(compiler, config);
// require("webpack-hot-middleware")(compiler, config);

/* reset */
const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');

fs.remove(path.join(process.cwd(), 'tmp')).then(function () {
    return fs.copy(path.join(process.cwd(), 'src'), path.join(process.cwd(), 'tmp'))
}).then(function () {
    /* type-vue prepare */

    // 为什么要这么做？重写原生的 require 方法
    // const Module = require('module');
    // const originalRequire = Module.prototype.require;

    // Module.prototype.require = function (m) {
    //     if (m === "./JsonpMainTemplatePlugin") {
    //         return require("../plugin/JsonpMainTemplatePlugin.js")
    //     }
    //     return originalRequire.apply(this, arguments);
    // };

    return new Promise(function (resolve, reject) {
        require('glob').glob(`${process.cwd()}/tmp/*.html`, function (err, files) {
            files.forEach(function (file) {
                const $ = require("cheerio").load(fs.readFileSync(file));
                const views = $("view"); // 拿到 index.html 里面的 view 节点
                views.first().replaceWith("<router-view></router-view>"); // 替换第一个 view 节点为 router-view
                views.remove(); // 移除其他的 view 节点

                //replace知会替换第一个匹配到的内容
                // let dist = file.replace(config.src,config.dist);
                // if(utils.existsSync(dist)){
                //     utils.removeSync(dist)
                // }

                // $(`<script src="bundle.js"></script>`).insertBefore($("script").first())

                fs.outputFile(file, $.html(), (err) => {
                    resolve(views) // 返回 views 节点，它还在
                });
            })
        })
    });
}).then(function (views) {
    const vueTemplate = require('lodash').template(`
        /**AUTO-GEN-START*/
        import __VUE__ from "vue"
        __VUE__.use(__LIGHT__);
        import __LIGHT__ from "light"
        __LIGHT__
        <%views.forEach(function(view){%>
        .route({
            path: '/<%=view.id%>',
            <%if(view.async=="true"){%>component: ()=>{return import("./<%=view.id%>.vue")},<%}%>
            <%if(!view.async||view.async=="false"){%>component: require("./<%=view.id%>.vue"),<%}%>
            <%if(view.parent){%>parent:"/<%=view.parent%>",<%}%>
            <%if(view.home){%>home:"/<%=view.home%>",<%}%>
        })
        <%})%>
        /**AUTO-GEN-END*/
    `);
    let v = [];
    views.each(function (i, view) {
        v.push(view.attribs)
    });

    let vueViewString = vueTemplate({
        views: v
    });

    // view/index.js ? 确实会生成一个 view/index.js 做什么用 ？
    fs.writeFileSync(path.join(process.cwd(), 'tmp', 'view', 'index.js'), `${vueViewString}`);
    return Promise.resolve()
}).then(function () {
    process.chdir(path.join(process.cwd(), 'tmp')); // 修改工作目录
    // process.mainModule.paths.push(`${__dirname}/node_modules`); // 新增 mainModule
    // process.env.NODE_ENV = process.env.NODE_ENV || "production";
    process.env.NODE_ENV = "dev";

    return new Promise(function (resolve) {
        if (process.env.NODE_ENV === "dev") {
            let compiler = webpack(require('../webpack.config'));
            global.middleware = [];

            const devModule = require("webpack-dev-middleware")(compiler, {
                noInfo: true,
                log: false
            });
            global.middleware.push(devModule);

            devModule.waitUntilValid(resolve);

            global.middleware.push(require("webpack-hot-middleware")(compiler, {
                noInfo: true,
                log: false
            }))
        } else {
            webpack(require('../webpack.config'), function () {
                console.log(12334444);
            });
        }
    })
}).then(function () {
    let server = require('http').createServer(),
        WebSocketServer = require('ws').Server,
        express = require("express"),
        url = require('url'),
        wss = new WebSocketServer({
            server: server
        });

    wss.setMaxListeners(0);

    let app = express();
    let port = 3000;

    let sockets = [];
    wss.on('connection', function (socket) {
        if (socket.id) return;

        socket.id = sockets.push(socket);
        socket.setMaxListeners(0);
        socket.on('message', function (message) {
            message = JSON.parse(message);
            if (message.type === "log") {

            }
        });

        socket.on('close', function () {
            delete sockets[socket.id];
        });
    });


    app.get(["**/*\.html", "/", "/_index"], function (req, res) {
        let path = req.path;
        if (path === "/") {
            path = "/index.html";
        }

        //支持JSN,动态程序入口
        if (path === "/_index") {
            const userAgent = req.headers['user-agent'];
            if (userAgent.indexOf("LightOS/JSN") > -1) {
                path = "/app.native.js";
            } else {
                path = "/index.html";
            }
        }


        res.set('Content-Type', 'text/html');
        fs.readFile(`../tmp/${path}`, function (err, html) {
            html += `
                    <script>
                        var ws = new WebSocket('ws://'+location.host);
                        if(window.Light) window.Light.Logger.websocket = ws;
                        ws.onmessage = function(data, flags) {
                          ws.close();
                          location.reload();
                        }
                    </script>
                `.replace(/\n/ig, "");

            res.send(new Buffer(html));
            res.end();
        });
    });

    //middleware support
    if (global.middleware) {
        for (let mid of global.middleware) {
            app.use(mid)
        }
    }

    app.use(express.static(path.resolve('../tmp')));

    server.on('request', app);
    server.listen(port);

    let exec = require('child_process').exec,
        cmd;
    switch (process.platform) {
        case 'win32':
            cmd = 'start';
            break;

        case 'linux':
            cmd = 'xdg-open';
            break;

        case 'darwin':
            cmd = 'open';
            break;
    };

    exec(cmd + " http://localhost:" + port);
}).catch(function (err) {
    throw err
})