const yargs = require('yargs');
const opts = yargs
    // .scriptName("arwen")
    .strict()
    .usage('Usage: arwen [command] [options]')
    .command(require('./service/create'))
    .command(require('./service/serve'))
    .command(require('./service/build'))
    .alias('h', 'help')
    .alias('v', 'version')
    .option('l', {
        alias: 'list',
        desc: 'list all supported build types',
        type: 'boolean'
    })
    .example('$0 -l', 'list all supported build types')
    .example('$0 create -t vue', 'generate vue type project')
    .example('$0 serve', 'debug for development environment')
    .example('$0 build', 'build for production environment')
    .epilog('https://kawhi.site')
    .argv;

if (opts.list) {
    console.log(`\nsupported template types: \n`);
    console.log('   vue: vue project based on the olight frame');
    // console.log('   react:  react project based on the react-scripts');
    // console.log('   jquery: jquery project based on the zepto');
}

if (!opts.help && !opts.version && !opts.list) {
    yargs.showHelp()
}