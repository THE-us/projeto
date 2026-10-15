'use strict';
const BaseCrudService = require('../../bases/base-crud-service');
const database = require('../../db/database');

class EquipamentoService extends BaseCrudService{
    constructor(){
        const db = database.getDatabase();
        super(db.Equipamento);
    }

    async validateCreate(){
        return true;
    }

    async validateUpdateById() {
        return true;
    }

    async validateDeleteById() {
        return true;
    }
}

module.exports = EquipamentoService;