exports.command = 'list';
exports.describe = 'list all supported build types';
exports.builder = {};
exports.handler = function (argv) {
    console.log(`\nsupported template types: \n`);
    console.log('   vue: vue project based on the olight frame');
    // console.log('   react:  react project based on the react-scripts');
    // console.log('   jquery: jquery project based on the zepto');
    console.log('');
}