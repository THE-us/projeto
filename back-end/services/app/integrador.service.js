'use strict';
const BaseCrudService = require('../../bases/base-crud-service');
const database = require('../../db/database');

class IntegradorService extends BaseCrudService {
    constructor() {
        const db = database.getDatabase();
        if (!db.Integrador) {
            throw new Error("O modelo db.Integrador está undefined! Verifique se o arquivo do model está exportando o nome corretamente.");
        }

        super(db.Integrador);
    }
}

module.exports = IntegradorService;