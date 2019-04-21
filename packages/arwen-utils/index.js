const chalk = require('chalk')
const fse = require('fs-extra')
const inquirer = require('inquirer')
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
    openBrowser,
    ora,
    semver,
    spawn,
    ErrorHandler,
    mergePkgConfig
}
