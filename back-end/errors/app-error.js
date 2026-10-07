'use strict';

class AppError extends Error{
    constructor(message, statusCode = 500, name = 'AppError'){
        super();
        this.message = message;
        this.statusCode = statusCode;
        this.name = name;
    }
}

module.exports = AppError;