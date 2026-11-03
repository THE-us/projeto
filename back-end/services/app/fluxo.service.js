'use strict';
const BaseCrudService = require('../../bases/base-crud-service');
const database = require('../../db/database');
const BadRequestError = require('../../errors/bad-request-error');
const { Op } = require('sequelize');

class FluxoService extends BaseCrudService{
    constructor(){
        const db = database.getDatabase();
        super(db.Fluxo);
    }

    montarFiltroPesquisa(filtros = {}) {
        const db = database.getDatabase();
        const where = {};
        const includeEquipamentoWhere = {};
        let temFiltroEquipamento = false;

        if (filtros.dataInicio && filtros.dataFim) {
            where.data = {
                [Op.gte]: filtros.dataInicio + ' 00:00:00',
                [Op.lte]: filtros.dataFim + ' 23:59:59'
            };
        }

        if (filtros.horaInicio && filtros.horaFim) {
            where.hora = { [Op.between]: [filtros.horaInicio, filtros.horaFim] };
        }

        if (filtros.placa) where.placa = filtros.placa;

        if (filtros.equipamentoCodigo) {
            includeEquipamentoWhere.codigo = { [Op.like]: `%${filtros.equipamentoCodigo}%` };
            temFiltroEquipamento = true;
        }
        if (filtros.equipamentoFaixa) {
            includeEquipamentoWhere.faixa = filtros.equipamentoFaixa;
            temFiltroEquipamento = true;
        }

        const include = [
            {
                model: db.Equipamento,
                attributes: ['id', 'codigo', 'faixa'],
                where: Object.keys(includeEquipamentoWhere).length > 0 ? includeEquipamentoWhere : undefined,
                required: temFiltroEquipamento
            }
        ];

        const temFiltro = Object.keys(where).length > 0 || temFiltroEquipamento;

        return { where, include, temFiltro };
    }

    async pesquisar(filtros) {
        const { where, include, temFiltro } = this.montarFiltroPesquisa(filtros);

        if (!temFiltro) {
            throw new BadRequestError('É necessário informar pelo menos um filtro para a pesquisa.');
        }

        const pagina = parseInt(filtros.pagina) || 1;
        const limite = parseInt(filtros.limite) || 30;
        const salto = (pagina - 1) * limite;

        const resultados = await this.model.findAndCountAll({
            where: where,
            limit: limite,
            offset: salto,
            order: [['data', 'DESC'], ['hora', 'DESC']],
            include: include
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
            group: ['Fluxo.equipamentoId', 'Equipamento.id', 'Equipamento.codigo', 'Equipamento.faixa'],
            order: [[db.sequelize.literal('totalFluxos'), 'DESC']]
        });

        return resultados;
    }

    async veiculoMaisIncidentes(filtros) {
        const db = database.getDatabase();
        const limite = parseInt(filtros.limite) || 1;

        return db.sequelize.query('CALL SP_VEICULO_MAIS_INCIDENTES(:limite)', {
            replacements: { limite }
        });
    }

    async equipamentoMaisAnalisouVeiculo(filtros) {
        if (!filtros.placa || filtros.placa.trim() === '') {
            throw new BadRequestError('É necessário informar a placa do veículo.');
        }

        const db = database.getDatabase();
        const placa = filtros.placa.trim().toUpperCase();
        const limite = parseInt(filtros.limite) || 1;

        return db.sequelize.query('CALL SP_EQUIPAMENTO_MAIS_ANALISOU_VEICULO(:placa, :limite)', {
            replacements: { placa, limite }
        });
    }
}

module.exports = FluxoService;
