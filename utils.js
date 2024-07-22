class AppError extends Error{
    constructor(status, message){
        super()
        this.status = status
        this.message = message
    }
}

const handleAsync = (fn) => {
    return function(req, res, next){
        fn(req, res, next).catch(e => next(e))
    }
}

module.exports.AppError = AppError
module.exports.handleAsync = handleAsync