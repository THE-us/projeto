'use strict';
const express = require('express');
const wrapAsync = require('../util/wrap.async');
const Response = require('../util/response');
const Validations = require('../util/validations');
const sqFilter = require('@isatech/express-sequelize-query-filter');

module.exports = () => {
    const router = express.Router();

    const findAll = async(req, res, Service, params) => {
        //console.log('este é req: ', req);

        const { filter } = req;
        const service = new Service(params);
        
        console.log('este é o service: ', service);
        //console.log('este é o filter: ', filter);
        
        const instances = await service.findAll(filter);

        //console.log('essas são as instancias: ', instances);
        
        Response.ok(res, instances); //linha 24
    };

    const create = async(req, res, Service, params) => {
        try {
            const { filter } = req;

            console.log('isso é o filter: ', filter);
            //console.log('*********************');

            const values = req.matchedBody || req.body;
            const service = new Service(params);

            const instance = await service.create(values, filter);
            Response.created(res, instance);
        } catch (error) {
            throw error;
        }
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
        sqFilter,
        deletedById,

        ...Validations,
    };
};