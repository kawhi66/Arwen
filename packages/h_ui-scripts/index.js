const {
    ErrorHandler
} = require('@arwen/arwen-utils')

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
        } else {
            throw new ErrorHandler('INVALID_ARWEN_TASK')
        }
    }
}
