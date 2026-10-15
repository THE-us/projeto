'use strict';
const BaseCrudService = require('../../bases/base-crud-service');
const database = require('../../db/database');

class MunicipioService extends BaseCrudService {
    constructor(){
        const db = database.getDatabase();
        super(db.Municipio);
    }
}

module.exports = MunicipioService;