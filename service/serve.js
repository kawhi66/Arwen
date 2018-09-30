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
exports.handler = function (argv) {
    console.log(argv)
}