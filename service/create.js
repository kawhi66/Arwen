const fs = require('fs-extra');
const path = require('path');

exports.command = 'create [name] [options]';
exports.describe = 'generate the project based on template';
exports.builder = {
    name: {
        alias: 'n',
        default: 'arwen',
        describe: 'specify the project name',
        type: 'string'
    },
    type: {
        alias: 't',
        default: 'vue',
        describe: 'specify the project type',
        type: 'string'
    }
};

exports.handler = function(argv) {
    const src = path.resolve(__dirname, '..', 'template', argv.type);
    const dest = path.join(process.cwd(), argv.name);

    /**
     * copy the template to the dest dir
     * merge template-defined package.json before createing one
     *
     * todo README.md ?
     * todo ARWEN_TYPE ? is that necessary ?
     */
    fs.copy(src, dest).then(() => {
        return fs.readJson(path.resolve(src, 'package.json'))
    }).then(result => {
        return fs.writeJson(path.resolve(dest, 'package.json'), Object.assign({
            name: argv.name,
            description: "an arwen project",
            version: "1.0.0"
        }, result), {
            spaces: '\t'
        })
    }).catch(err => {
        console.error(err)
    })
}
