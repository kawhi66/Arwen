'use strict';

const path = require('path')
const promisify = require('util').promisify
const chalk = require('@arwen/arwen-utils').chalk
const Client = require('ssh2').Client
const tv4 = require('tv4')
const glob = require('glob')

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
                        type: ['string', 'array']
                    },
                    remotePath: {
                        type: 'string'
                    },
                    preDeploy: {
                        type: ['string', 'array']
                    },
                    postDeploy: {
                        type: ['string', 'array']
                    },
                    silent: {
                        type: 'boolean'
                    }
                }
            })) {
            return reject(`Something wrong with the config, ${chalk.red(tv4.error.message)}`)
        }

        const sshClient = new Client()
        const auth = Object.assign({
            port: 22
        }, config.auth)

        sshClient.on('ready', async function() {
            try {
                // executing predeploy commmands
                if (config.preDeploy && config.preDeploy.length > 0) {
                    for (const command of config.preDeploy) {
                        await execCommand(sshClient, command)
                    }
                }

                // deploying files
                if (config.localFiles && config.remotePath) {
                    const filePaths = await resolveFilePaths(config.localFiles, config.remotePath)
                    if (filePaths.length > 0) {
                        await copy(sshClient, filePaths)
                    }
                }

                // executing postdeploy commands
                if (config.postDeploy && config.postDeploy.length > 0) {
                    for (const command of config.postDeploy) {
                        await execCommand(sshClient, command)
                    }
                }

                resolve()
            } catch (error) {
                reject(error)
            } finally {
                sshClient.end()
            }
        })

        sshClient.on('error', error => {
            reject(error)
        })

        sshClient.connect(auth)
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
                console.log(data.toString())
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
        if (typeof localFiles === 'string') {
            glob(localFiles, {
                absolute: true
            }, function(error, files) {
                if (error) return reject(error)

                const slashIndex = getLastCommonSlashIndex(files)
                resolve(files.map(function(filePath) {
                    return {
                        localPath: filePath,
                        remotePath: remotePath + filePath.substring(slashIndex)
                    }
                }))
            })
        } else {
            resolve(localFiles.map(function(filePath) {
                return {
                    localPath: path.resolve(filePath),
                    remotePath: remotePath + '/' + path.basename(filePath)
                }
            }))
        }
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
