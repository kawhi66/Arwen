const chalk = require('chalk')
const fse = require('fs-extra')
const openBrowser = require('react-dev-utils/openBrowser')
const spawn = require('cross-spawn')

const ErrorHandler = require('./error')
const mergePkgConfig = require('./mergePkgConfig')

module.exports = {
    chalk,
    fse,
    openBrowser,
    spawn,
    ErrorHandler,
    mergePkgConfig
}
