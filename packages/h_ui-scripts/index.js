module.exports = class Service {
    constructor(port) {
        process.env.ARWEN_PORT = port
    }

    /**
     * @description run the task registered in the lib
     * @param {String} task name
     */
    run(task) {
        require(`./lib/${task}`)()
    }
}
