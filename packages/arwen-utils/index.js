const chalk = require('chalk')
const fse = require('fs-extra')
const inquirer = require('inquirer')
const log = require('fancy-log')
const openBrowser = require('react-dev-utils/openBrowser')
const ora = require('ora')
const semver = require('semver')
const spawn = require('cross-spawn')

const ErrorHandler = require('./error')
const mergePkgConfig = require('./mergePkgConfig')

module.exports = {
    chalk,
    fse,
    inquirer,
    log,
    openBrowser,
    ora,
    semver,
    spawn,
    ErrorHandler,
    mergePkgConfig
}
