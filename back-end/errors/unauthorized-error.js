'use strict';
const AppError = require('./app-error');

class UnauthorizedError extends AppError{
    constructor(message = 'Unauthorized', name= 'Unauthorized'){
        super(message, 401, name);
    }
}

module.exports = UnauthorizedError;