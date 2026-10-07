'use strict';
const { validationResult, checkSchema, matchedData, param } = require('express-validator');
const ValidationError = require('../errors/validation-error');

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    next(new ValidationError(errors.array()));
  };
};

const validateSchema = (schema) => {
  return validate(checkSchema(schema));
};

const validateBodyIsArray = (options) => {
  return (req, res, next) => {
    if (!Array.isArray(req.body)) {
      throw new ValidationError('Invalid request body: it should be an array');
    }
    if (options?.min && req.body.length < options.min) {
      throw new ValidationError(`Invalid request body: min array size is ${options.min}`);
    }
    if (options?.max && req.body.length > options.max) {
      throw new ValidationError(`Invalid request body: max array size is ${options.max}`);
    }
    next();
  };
};

const matchedBody =
  (includeOptionals = true) =>
  (req, res, next) => {
    req.matchedBody = matchedData(req, { locations: ['body'], includeOptionals });
    next();
  };

const matchedQuery =
  (includeOptionals = true) =>
  (req, res, next) => {
    req.matchedQuery = matchedData(req, { locations: ['query'], includeOptionals });
    next();
  };

const getSchema = (schema, options) => {
  if (!options) {
    return schema;
  }

  const newSchema = Object.assign({}, schema);

  if (options.exclude) {
    options.exclude.forEach((prop) => {
      delete newSchema[prop];
    });
  }

  if (options.allOptional) {
    Object.keys(newSchema).forEach((prop) => {
      newSchema[prop] = { ...newSchema[prop] };
      newSchema[prop].optional = { options: { nullable: true } };
    });
  } else {
    if (options.optional) {
      options.optional.forEach((prop) => {
        newSchema[prop] = { ...newSchema[prop] };
        newSchema[prop].optional = { options: { nullable: true } };
      });
    }
  }

  return newSchema;
};

const validateParamIdAsIntAndSanitize = () => {
  return validate([param('id').isInt().toInt()]);
};

const RegexPatterns = Object.freeze({
  TIME: /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/,
  PLACA: /^([A-Z]{3}\d{4})$|^([A-Z]{3}\d{1}[A-Z]\d{2})$/,
  DECIMAL52: /^([0-9]{1,3})$|^([0-9]{1,3}[.][0-9]{0,2})$/,
});

module.exports = {
  validate,
  validateSchema,
  validateBodyIsArray,
  matchedBody,
  matchedQuery,
  getSchema,
  validateParamIdAsIntAndSanitize,
  RegexPatterns,
};
