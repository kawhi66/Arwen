exports.command = 'list';
exports.describe = 'list all supported build types';
exports.builder = {};
exports.handler = function () {
    console.log(`\nsupported template types: \n`);
    require('./lib/supported').supported_with_desc.forEach(function (item) {
        console.log(`   ${item.type}: ${item.description}`);
    })
    console.log('');
};