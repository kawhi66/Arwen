const fs = require('fs-extra')
const path = require('path')

exports.command = 'build'
exports.describe = 'compile and build'
exports.builder = {}
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

        require(`./${type}-scripts/lib/build.js`)();
    }).catch(err => {
        console.error('[error]: ', require('util').inspect(err))
    })
};
