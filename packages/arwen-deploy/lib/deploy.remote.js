'use strict';

const chalk = require('@arwen/arwen-utils').chalk
const Client = require('ssh2').Client
const glob = require('glob')
const log = require('@arwen/arwen-utils').log
const path = require('path')
const promisify = require('util').promisify
const tv4 = require('tv4')

let keepSilent = false

// TODO: config.localFiles can't be an array
// TODO: logs
module.exports = remoteDeploy

function remoteDeploy(config) {
    return new Promise(function(resolve, reject) {
        tv4.addSchema('authSchema', {
            type: 'object',
            required: ["host", "username", "password"],
            properties: {
                host: {
                    type: ['string', 'array']
                },
                username: {
                    type: 'string',
                    minLength: 1
                },
                password: {
                    type: 'string'
                }
            }
        })

        if (!tv4.validate(config, {
                type: 'object',
                required: ["auth", "localFiles", "remotePath"],
                properties: {
                    auth: {
                        $ref: 'authSchema'
                    },
                    localFiles: {
                        type: 'string' // 暂时先不支持数组形式的 localFiles
                    },
                    remotePath: {
                        type: 'string'
                    },
                    prePush: {
                        type: ['string', 'array']
                    },
                    postPush: {
                        type: ['string', 'array']
                    },
                    silent: {
                        type: 'boolean'
                    }
                }
            })) {
            return reject(`Something wrong with the config, ${chalk.red(tv4.error.message)}`)
        } else keepSilent = config.silent;

        !keepSilent && log.info(`Connecting to ${chalk.green(config.auth.host + ":" + config.auth.port)}`)

        const sshClient = new Client()
        sshClient.on('ready', async function() {
            try {
                // executing prePush commmands
                if (config.prePush && config.prePush.length > 0) {
                    for (const command of config.prePush) {
                        !keepSilent && log.info(`Running command ${chalk.green(command)} before push`)
                        await execCommand(sshClient, command)
                    }
                }

                // deploying files
                if (config.localFiles && config.remotePath) {
                    const filePaths = await resolveFilePaths(config.localFiles, config.remotePath)
                    if (filePaths.length > 0) {
                        !keepSilent && log.info(`Pushing to ${chalk.green(config.remotePath)}`)
                        await copy(sshClient, filePaths);
                        !keepSilent && log.info(`Push succeed`)
                    }
                }

                // executing postPush commands
                if (config.postPush && config.postPush.length > 0) {
                    for (const command of config.postPush) {
                        !keepSilent && log.info(`Running command ${chalk.green(command)} after push`)
                        await execCommand(sshClient, command)
                    }
                }

                resolve()
            } catch (error) {
                reject(error)
            } finally {
                !keepSilent && log.info(`Closing connection to ${chalk.green(config.auth.host + ":" + config.auth.port)}`)
                sshClient.end()
            }
        })

        sshClient.on('error', error => {
            !keepSilent && log.error(`Connect to ${chalk.green(config.auth.host + ":" + config.auth.port)} failed`)
            reject(error)
        })

        sshClient.connect(Object.assign({
            port: 22
        }, config.auth))
    })
}

function execCommand(sshClient, command) {
    return new Promise(function(resolve, reject) {
        let errorData = ''
        sshClient.exec(command, function(err, stream) {
            if (err) return reject(err)

            stream.on('close', function() {
                if (errorData != '') {
                    reject(errorData)
                } else {
                    resolve()
                }
            })

            stream.on('data', function(data) {
                log(data.toString())
            })

            stream.stderr.on('data', function(data) {
                errorData += data
            })
        })
    })
}

function copy(sshClient, filePaths) {
    return new Promise(function(resolve, reject) {
        sshClient.sftp(async function(err, sftp) {
            if (err) return reject(err)

            const copyFile = promisify(sftp.fastPut)
            const openDir = promisify(sftp.opendir)
            const makeDir = promisify(sftp.mkdir)
            const ensureDir = async function(remoteDirPath) {
                const pathSplit = remoteDirPath.split('/')
                let dirFound = false
                let i = pathSplit.length

                while (!dirFound && i >= 0) {
                    const path = pathSplit.slice(0, i).join('/')

                    try {
                        await openDir.call(sftp, path)
                    } catch (error) {
                        i--
                        continue
                    }

                    dirFound = true
                }

                while (i < pathSplit.length) {
                    i++
                    await makeDir.call(sftp, pathSplit.slice(0, i).join('/'))
                }
            } // TODO: is this the best way ?

            try {
                for (const filePath of filePaths) {
                    const pathDescriptor = path.parse(filePath.remotePath)
                    if (pathDescriptor.name == '' || pathDescriptor.ext == '') { // 过滤掉对目录的处理
                        continue
                    }

                    !keepSilent && log.info(`Pushing ${filePath.localPath}`)
                    await ensureDir(path.dirname(filePath.remotePath))
                    await copyFile.call(sftp, filePath.localPath, filePath.remotePath)
                }

                resolve()
            } catch (error) {
                reject(error)
            }
        })
    })
}

function resolveFilePaths(localFiles, remotePath) {
    return new Promise(function(resolve, reject) {
        glob(localFiles, {}, function(error, files) {
            if (error) return reject(error)

            const slashIndex = getLastCommonSlashIndex(files)
            resolve(files.map(function(filePath) {
                return {
                    localPath: filePath,
                    remotePath: remotePath + filePath.substring(slashIndex)
                }
            }))
        })
    })
}

function getLastCommonSlashIndex(filePathArray) {
    let minIndex = Number.MAX_SAFE_INTEGER

    for (const filePath of filePathArray) {
        const slashIndex = filePath.lastIndexOf('/')
        if (slashIndex < minIndex) {
            minIndex = slashIndex
        }
    }

    return minIndex
}
