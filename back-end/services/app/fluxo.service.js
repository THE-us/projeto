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
        const db = database.getDatabase(); // Necessário para acessar o modelo Equipamento
        const where = {};
        const includeEquipamentoWhere = {};
        let temFiltroEquipamento = false;

        if (filtros.dataInicio && filtros.dataFim) {
            where.data = { [Op.between]: [filtros.dataInicio, filtros.dataFim] };
        }

        if (filtros.horaInicio && filtros.horaFim) {
            where.hora = { [Op.between]: [filtros.horaInicio, filtros.horaFim] };
        }

        if (filtros.placa) where.placa = filtros.placa;

        // Novos filtros baseados no PDF
        if (filtros.equipamentoCodigo) {
            includeEquipamentoWhere.codigo = { [Op.like]: `%${filtros.equipamentoCodigo}%` };
            temFiltroEquipamento = true;
        }
        if (filtros.equipamentoFaixa) {
            includeEquipamentoWhere.faixa = filtros.equipamentoFaixa;
            temFiltroEquipamento = true;
        }

        const temFiltroFluxo = Object.keys(where).length > 0;
        if (!temFiltroFluxo && !temFiltroEquipamento) {
            throw new Error('É necessário informar pelo menos um filtro para a pesquisa.');
        }

        const pagina = parseInt(filtros.pagina) || 1;
        const limite = parseInt(filtros.limite) || 30;
        const salto = (pagina - 1) * limite;

        const resultados = await this.model.findAndCountAll({
            where: where,
            limit: limite,
            offset: salto,
            order: [['data', 'DESC'], ['hora', 'DESC']],
            include: [
                {
                    model: db.Equipamento,
                    attributes: ['id', 'codigo', 'faixa'], // Traz esses dados para a tela
                    where: Object.keys(includeEquipamentoWhere).length > 0 ? includeEquipamentoWhere : undefined,
                    required: temFiltroEquipamento // Se tiver filtro, obriga a achar. Se não, traz tudo.
                }
            ]
        });

        return {
            dados: resultados.rows,
            totalRegistros: resultados.count,
            paginaAtual: pagina,
            totalPaginas: Math.ceil(resultados.count / limite)
        };
    }

    async analisar(filtros) {
        const db = database.getDatabase();
        const where = {};

        // Força a inclusão de hora para anular a conversão UTC do Sequelize
        if (filtros.dataInicio && filtros.dataFim) {
            where.data = {
                [Op.gte]: filtros.dataInicio + ' 00:00:00',
                [Op.lte]: filtros.dataFim + ' 23:59:59'
            };
        }

        const resultados = await this.model.findAll({
            where: where,
            attributes: [
                'equipamentoId',
                [db.sequelize.fn('COUNT', db.sequelize.col('Fluxo.id')), 'totalFluxos']
            ],
            include: [
                {
                    model: db.Equipamento,
                    attributes: ['id', 'codigo', 'faixa'] 
                }
            ],
            // Agrupamento estrito para evitar crashes 500 no MySQL 8
            group: ['Fluxo.equipamentoId', 'Equipamento.id', 'Equipamento.codigo', 'Equipamento.faixa'],
            order: [[db.sequelize.literal('totalFluxos'), 'DESC']]
        });

        return resultados;
    }
}

module.exports = FluxoService;