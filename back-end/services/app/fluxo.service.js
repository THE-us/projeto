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
            where.data = { [Op.between]: [filtros.dataInicio, filtros.dataFim] };
        }

        if (filtros.horaInicio && filtros.horaFim) {
            where.hora = { [Op.between]: [filtros.horaInicio, filtros.horaFim] };
        }

        if (filtros.placa) where.placa = filtros.placa;
        if (filtros.equipamentoId) where.equipamentoId = filtros.equipamentoId;

        const temFiltro = Object.keys(where).length > 0;
        if (!temFiltro) {
            throw new Error('É necessário informar pelo menos um filtro para a pesquisa.');
        }

        // --- LÓGICA DE PAGINAÇÃO ---
        const pagina = parseInt(filtros.pagina) || 1;
        const limite = parseInt(filtros.limite) || 30;
        const salto = (pagina - 1) * limite;

        // findAndCountAll traz os dados E o total geral do banco
        const resultados = await this.model.findAndCountAll({
            where: where,
            limit: limite,
            offset: salto,
            order: [['data', 'DESC'], ['hora', 'DESC']]
        });

        // Retorna um objeto estruturado para o Front-end
        return {
            dados: resultados.rows,          // As 30 linhas da tabela
            totalRegistros: resultados.count, // Ex: 65.430
            paginaAtual: pagina,
            totalPaginas: Math.ceil(resultados.count / limite)
        };
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