const AppError = require('./app-error');

function appErrorHandler(err, req, res, next){
    if(err instanceof AppError){
        return res.status(err.statusCode).send({
            ...err,
        });
    }
}

module.exports = appErrorHandler;