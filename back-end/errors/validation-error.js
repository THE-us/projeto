'use strict';
const BadRequestError = require('./bad-request-error');

class ValidationError extends BadRequestError{
    constructor(message = 'Validation Error'){
        super(message, 'ValidationError', false);
        this.validationError = true;
    }
}

module.exports = ValidationError;