exports.command = 'create [options]';
exports.describe = 'generation';
exports.builder = {
    list: {
        alias: 'l',
        describe: 'list all supported build type',
        type: 'boolean'
    },
    type: {
        alias: 't',
        default: 'vue',
        describe: 'specify the project type of generate',
        type: 'string'
    }
};
exports.handler = function (argv) {
    console.log(argv)
}