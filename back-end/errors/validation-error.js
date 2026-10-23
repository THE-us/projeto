'use strict';
const BadRequestError = require('./bad-request-error');

class ValidationError extends BadRequestError {
    constructor(details = [], message = 'Validation Error') {
        const formattedMessage = Array.isArray(details) 
            ? details.map(d => typeof d === 'string' ? d : (d.message || JSON.stringify(d))).join('; ')
            : details;

        super(formattedMessage || message, 'ValidationError', false);
        
        this.validationError = true;
        this.details = details;
    }
}

module.exports = ValidationError;