const fs = require('fs-extra');
const path = require('path');

exports.command = 'serve [options]';
exports.describe = 'launch the server for development mode';
exports.builder = {
    port: {
        alias: 'p',
        default: '3000',
        describe: 'set the port',
        type: 'string'
    }
};

exports.handler = function(argv) {
    fs.readJson(path.resolve(process.cwd(), 'package.json')).then(result => {
        const type = (() => {
            const {
                arwen_type
            } = result;

            if (['vue', 'h_ui'].includes(arwen_type)) {
                return 'vue'
            } else if (['react'].includes(arwen_type)) {
                return 'react'
            };
        })();

        // set ARWEN_PORT
        process.env.ARWEN_PORT = argv.port;

        require(`./${type}-scripts/lib/serve.js`)();
    }).catch(err => {
        console.error('[error]: ', require('util').inspect(err))
    })
}
