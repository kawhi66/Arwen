module.exports = class ErrorHandler {
    constructor(code, message) {
        this.is_arwen = true
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
    INVALID_TYPE: 'invalid arwen type, please make sure this is an arwen project',
    INVALID_DEPLOY_SIGNAL: 'invalid arwen deploy signal, please specify a valid deploy signal',
    INVALID_CWD: 'invalid work directory, please run this command in arwen project directory'
}
