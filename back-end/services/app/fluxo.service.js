'use strict';
const BaseCrudService = require('../../bases/base-crud-service');
const database = require('../../db/database');
const Error = require('../../errors/app-error-handler')
const { Op } = require('sequelize');

class FluxoService extends BaseCrudService{
    constructor(){
        const db = database.getDatabase();
        super(db.Fluxo);
    }

    async pesquisar(filtros) {
        const where = {};

        if (filtros.dataInicio && filtros.dataFim) {
            where.data = {
                [Op.between]: [filtros.dataInicio, filtros.dataFim]
            };
        }

        if (filtros.horaInicio && filtros.horaFim) {
            where.hora = {
                [Op.between]: [filtros.horaInicio, filtros.horaFim]
            };
        }

        if (filtros.placa) where.placa = filtros.placa;
        if (filtros.equipamentoId) where.equipamentoId = filtros.equipamentoId;

        const temFiltro = Object.keys(where).length > 0;
        if (!temFiltro) {
            throw new Error('É necessário informar pelo menos um filtro para a pesquisa.');
        }

        const resultados = await this.model.findAll({
            where: where,
            limit: 30,
            order: [['data', 'DESC'], ['hora', 'DESC']]
        });

        return resultados;
    }

    async analisar(filtros) {
        const db = database.getDatabase();
        const where = {};

        if (filtros.dataInicio && filtros.dataFim) {
            where.data = {
                [Op.between]: [filtros.dataInicio, filtros.dataFim]
            };
        }

        const resultados = await this.model.findAll({
            where: where,
            attributes: [
                'equipamentoId', 
                [db.sequelize.fn('COUNT', db.sequelize.col('Fluxo.id')), 'totalFluxos']
            ],
            group: ['equipamentoId'],
            include: [
                {
                    model: db.Equipamento, 
                    attributes: ['id', 'codigo', 'faixa']
                }
            ]
        });

        return resultados;
    }
}

module.exports = FluxoService;