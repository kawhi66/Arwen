const yargs = require('yargs');
const opts = yargs
    // .scriptName("arwen")
    .strict()
    .usage('Usage: arwen [command] [options]')
    .command(require('./service/create'))
    // .command(require('./service/list'))
    .command(require('./service/serve'))
    .command(require('./service/build'))
    .alias('h', 'help')
    .alias('v', 'version')
    .example('$0 create -t vue', 'generate vue type project')
    .example('$0 list', 'list all supported build types')
    .example('$0 serve', 'debug for development environment')
    .example('$0 build', 'build for production environment')
    .epilog('https://kawhi.site')
    .argv;

if (!opts.help && !opts.version && !opts._.length) {
    yargs.showHelp()
}
