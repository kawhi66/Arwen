const {
    ErrorHandler,
    fse: fs
} = require('@arwen/arwen-utils')

/**
 * @description async middleware to verify if the current work directory is an valid an arwen project
 * @description it should only work for command serve and build
 * @param {object} argv
 */
module.exports = function(argv) {
    return new Promise((resolve, reject) => {
        const pkgPath = './package.json'

        fs.pathExists(pkgPath).then(function(exists) {
            if (exists) {
                fs.readJson(pkgPath).then(function(pkgConfig) {
                    if (pkgConfig.arwen && pkgConfig.arwen.type) {
                        return resolve(Object.assign({}, pkgConfig.arwen, argv))
                    } else {
                        return reject(new ErrorHandler('INVALID_TYPE'))
                    }
                })
            } else {
                return reject(new ErrorHandler('INVALID_CWD'))
            }
        }).catch(function(err) {
            return reject(err)
        })
    })
}
