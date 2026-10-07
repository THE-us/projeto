'use strict';
const AppError = require('./app-error');

class ForbiddenError extends AppError{
    constructor(message = 'Forbidden', name = 'Forbidden'){
        super(message, 403, name);
    }
}

module.exports = ForbiddenError;