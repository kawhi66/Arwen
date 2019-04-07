const path = require('path')
const fs = require('fs-extra')
const merge = require('merge')

/**
 * @description merge package.json
 * @description if pass nothing, it will try to read ./package.json and return
 * @description if something wrong, it will return {}, but no error
 * @WARNING won't perform well if there are too many
 * @param {String} pkgPath package.json's relative path
 */
module.exports = function(pkgPath1) {
    const args = [...arguments]

    if (args.length <= 1) {
        try {
            return fs.readJsonSync(pkgPath1 ? pkgPath1 : './package.json')
        } catch (e) {
            return {}
        }
    } else {
        const p = args.map(pkgPath => {
            try {
                return fs.readJsonSync(path.resolve(process.cwd(), pkgPath))
            } catch (e) {
                return {}
            }
        })

        return p.reduce((result, pkgConfig) => {
            return merge.recursive(true, result, pkgConfig)
        }, {})
    }
}
