const fs = require('fs-extra');
const path = require('path');

let server = require('http').createServer(),
    WebSocketServer = require('ws').Server,
    express = require("express"),
    url = require('url'),
    wss = new WebSocketServer({server: server});

wss.setMaxListeners(0);

/**
 * 打开浏览器并开启server
 */
module.exports = function (middleware) {

    // if (options.browser){
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
                    console.log(message.userAgent, message.message)
                }
            });

            socket.on('close', function () {
                delete sockets[socket.id];
            });
        });


        app.get(["**/*\.html", "/"], function (req, res) {
            res.set('Content-Type', 'text/html');
            fs.readFile(path.join(process.cwd(), 'build', 'index.html'),function (err, html) {
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
        if(middleware){
            app.use(middleware)
        }

        app.use(express.static(path.join(process.cwd(), 'build')));

        server.on('request', app);
        server.listen(port);

        require('child_process').exec("start http://localhost:" + port)

        return Promise.resolve(sockets);
    // }

    // return Promise.resolve();
};