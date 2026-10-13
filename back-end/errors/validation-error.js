'use strict';
const BadRequestError = require('./bad-request-error');

class ValidationError extends BadRequestError {
    constructor(details = [], message = 'Validation Error') {
        // Se 'details' for um array, formata a mensagem principal como texto
        const formattedMessage = Array.isArray(details) 
            ? details.map(d => typeof d === 'string' ? d : (d.message || JSON.stringify(d))).join('; ')
            : details;

        super(formattedMessage || message, 'ValidationError', false);
        
        this.validationError = true;
        this.details = details; // Guarda o array/objeto original intacto
    }
}

module.exports = ValidationError;