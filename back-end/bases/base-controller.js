'use strict';
const express = require('express');
const wrapAsync = require('../util/wrap.async');
const Response = require('../util/response');
const Validations = require('../util/validations');

module.exports = () => {
    const router = express.Router();

    const findAll = async(req, res, Service, params) => {
        const { filter } = req;
        const service = new Service(params);
        const instances = await service.findAll(filter);
        ReportingObserver.ok(res, instances);
    };

    const create = async(req, res, Service, params) => {
        const { filter } = req;
        const values = req.matchedBody || req.body;
        const service = new Service(params);
        values.createdBy = req.user?.id;
        values.updatedBy = req.user?.id;
        const instance = await service.create(values, filter);
        Response.created(res, instance);
    };

    const deletedById = async(req, res, Service, params) => {
        const { id } = req.params;
        const service = new Service(params);
        const deleted = await service.deletedByIdOrThrowError(id);
        Response.deleted(res, { deleted });
    };

    return {
        router,
        Response,
        wrapAsync,
        findAll,
        create,
        deletedById,

        ...Validations,
    };
};