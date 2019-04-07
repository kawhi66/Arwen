const fse = require('fs-extra')
const path = require('path')
const spawn = require('cross-spawn')
const openBrowser = require('react-dev-utils/openBrowser')
const ErrorHandler = require('./error')
const mergePkgConfig = require('./mergePkgConfig')

module.exports = {
    fse,
    path,
    spawn,
    openBrowser,
    ErrorHandler,
    mergePkgConfig
}
