const path = require('path')
const openBrowser = require('react-dev-utils/openBrowser')
const ErrorHandler = require('./error')
const mergePkgConfig = require('./mergePkgConfig')

module.exports = {
    openBrowser,
    ErrorHandler,
    mergePkgConfig
}
