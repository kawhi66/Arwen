/**
 * @description ${ARWEN_TYPE}-scripts core implementation
 * @return Service class
 */
module.exports = class Service {
    constructor(port) {
        process.env.ARWEN_PORT = port
    }

    /**
     * @description run the task registered in the lib
     * @param {String} task 'serve' or 'build'
     */
    run(task) {
        require(`./lib/${task}`)()
    }
}
