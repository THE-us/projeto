'use strict';
const BaseCrudService = require('../../bases/base-crud-service');
const database = require('../../db/database');
const { Op } = require('sequelize');

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

    montarFiltroPesquisa(filtros = {}) {
        const { Integrador } = database.getDatabase();
        const { codigo, faixa, ativo, integradorNome } = filtros;
        const where = {};

        if (codigo) where.codigo = { [Op.like]: `%${codigo}%` };
        if (faixa) where.faixa = faixa;
        if (ativo !== undefined && ativo !== null && ativo !== '') where.ativo = ativo;

        const include = [];

        if (integradorNome) {
            include.push({
                model: Integrador,
                where: { nome: { [Op.like]: `%${integradorNome}%` } },
                required: true
            });
        } else if (Integrador) {
            include.push({
                model: Integrador,
                required: false
            });
        }

        return { where, include };
    }
}

module.exports = EquipamentoService;
