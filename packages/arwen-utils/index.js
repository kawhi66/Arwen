const path = require('path')
const fse = require('fs-extra')
const openBrowser = require('react-dev-utils/openBrowser')
const ErrorHandler = require('./error')
const mergePkgConfig = require('./mergePkgConfig')

module.exports = {
    fse,
    openBrowser,
    ErrorHandler,
    mergePkgConfig
}
