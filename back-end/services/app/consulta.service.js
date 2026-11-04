'use strict';

const database = require('../../db/database');
const {
    Op,
    QueryTypes
} = require('sequelize');

class ConsultaService{
    async pesquisarPassagens(query){
        await this.expandFilterWithNumGrinFromCodEquipAndFaixa(query);

        const { Fluxo } =  database.getDatabase();
        const filter = this.getFilterPesquisarPassagens(query);

        return Fluxo.findAll(filter);
    }

    async countPesquisarPassagens(query){
        await this.expandFilterWithNumGrinFromCodEquipAndFaixa(query);

        const { Fluxo } = database.getDatabase();
        const Filter = this.getFilterPesquisarPassagens(query);

        return Fluxo.count(filter);
    }
}

module.exports = ConsultaService;