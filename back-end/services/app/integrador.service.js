'use strict';
const BaseCrudService = require('../../bases/base-crud-service');
const database = require('../../db/database');

class IntegradorService extends BaseCrudService{
    constructor(){
        super(database.getDatabase());
    }

    async puxarTodos(req, res){
        const puxar = new BaseCrudService();

        await puxar.findAll(req);

        if(!puxar){
            return null;
        }

        return puxar;
    }
}

module.exports = IntegradorService;