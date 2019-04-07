module.exports = function(name) {
    return require(require.resolve(`${name}`, {
        paths: [
            process.cwd()
        ]
    }))
}
