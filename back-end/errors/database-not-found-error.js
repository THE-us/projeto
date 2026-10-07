'use strict';

const AppError = require('./app-error');

class DatabaseNotFoundError extends AppError{
    constructor(message, baseMessage = 'Database Not Found', name = 'DatabaseNotFoundError'){
        super(`${baseMessage}${message ? message : ''}`, 500, name);
    }
}

module.exports = DatabaseNotFoundError;