const fs = require('fs-extra')

module.exports = class Service {
    constructor() {
        // todo
    }

    /**
     * @description run the task registered in the lib
     * @param {String} task name
     */
    run(task) {
        if (['serve', 'build'].includes(task)) {
            require(`./lib/${task}`)()
        } else throw new Error({
            code: 'INVALID_ARWEN_TASK',
            message: 'invalid arwen task, you many wanna run arwen --help'
        })
    }
}
