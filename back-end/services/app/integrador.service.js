'use strict';
const BaseCrudService = require('../../bases/base-crud-service');
const database = require('../../db/database');

class IntegradorService extends BaseCrudService{
    constructor(){
        super(database.getDatabase().Integrador.scope('excludeToken'));
    }
}

module.exports = IntegradorService;