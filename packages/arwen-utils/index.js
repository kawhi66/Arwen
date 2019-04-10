const chalk = require('chalk')
const fse = require('fs-extra')
const openBrowser = require('react-dev-utils/openBrowser')
const ora = require('ora')
const semver = require('semver')
const spawn = require('cross-spawn')

const ErrorHandler = require('./error')
const mergePkgConfig = require('./mergePkgConfig')

module.exports = {
    chalk,
    fse,
    openBrowser,
    ora,
    semver,
    spawn,
    ErrorHandler,
    mergePkgConfig
}
