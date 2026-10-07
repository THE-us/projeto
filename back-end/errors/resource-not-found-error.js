'use strict';
const AppError = require('./app-error');

class ResourceNotFoundError extends AppError{
    constructor(message = 'Resource Not Found', name = 'ResourceNotFoundError'){
        super(message, 404, name);
    }
}

module.exports = ResourceNotFoundError;