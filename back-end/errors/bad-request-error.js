'use strict';
const AppError = require('./app-error');

class BadRequestError extends AppError{
    constructor(message = 'Bad Request', name = 'BadRequestError'){
        super(message, 400, name);
    }
}

module.exports = BadRequestError;