/**
 * @description normalize the error instance
 * @description a standard error handler in arwen project could be
 * @description new Promise().catch(err => {
 * @description   if(!err.arwen) {
 * @description     err = new ErrorHandler('UNKNOWN_ERROR')
 * @description   }
 * @description   console.error(`${err.code}: ${err.message}`)
 * @description })
 * @todo how to get the stack of error
 */
module.exports = class ErrorHandler {
    constructor(code, message) {
        this.isArwen = true
        if (typeof code == 'string') {
            this.code = code || 'UNKNOWN_ERROR'
            if (_ERR_CODES_.hasOwnProperty(this.code)) {
                this.message = _ERR_CODES_[this.code]
            } else {
                this.message = message || _ERR_CODES_.UNKNOWN_ERROR
            }
        } else if (typeof code == 'object') {
            this.code = code.code || 'UNKNOWN_ERROR'
            if (_ERR_CODES_.hasOwnProperty(this.code)) {
                this.message = _ERR_CODES_[this.code]
            } else {
                this.message = code.message || _ERR_CODES_.UNKNOWN_ERROR
            }
        } else {
            this.code = 'UNKNOWN_ERROR'
            this.message = _ERR_CODES_[this.code]
        }
    }
}

const _ERR_CODES_ = {
    UNKNOWN_ERROR: 'unknown error',
    INVALID_ARWEN_TYPE: 'invalid arwen type, this may not an arwen project',
    INVALID_ARWEN_TASK: 'invalid arwen task, you many wanna run arwen --help',
    INVALID_ARWEN_DEPLOY_SIGNAL: 'invalid arwen deploy signal, you may wanna run arwen deploy --help',
    INVALID_PORT: 'invalid port'
}
