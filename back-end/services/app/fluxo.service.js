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

    async montarFiltroPesquisa(filtros = {}) {
        const db = database.getDatabase();
        const where = {};
        const whereEquipamento = {};

        if (filtros.dataInicio && filtros.dataFim) {
            where.data = { [Op.between]: [filtros.dataInicio, filtros.dataFim] };
        }

        if (filtros.horaInicio && filtros.horaFim) {
            where.hora = { [Op.between]: [filtros.horaInicio, filtros.horaFim] };
        }

        if (filtros.placa) where.placa = filtros.placa;

        if (filtros.equipamentoCodigo) whereEquipamento.codigo = { [Op.like]: `%${filtros.equipamentoCodigo}%` };
        if (filtros.equipamentoFaixa) whereEquipamento.faixa = filtros.equipamentoFaixa;

        if (Object.keys(whereEquipamento).length > 0) {
            const equipamentos = await db.Equipamento.findAll({
                where: whereEquipamento,
                attributes: ['id'],
                raw: true
            });
            where.equipamentoId = { [Op.in]: equipamentos.map(e => e.id) };
        }

        const include = [
            {
                model: db.Equipamento,
                attributes: ['id', 'codigo', 'faixa', 'local', 'velocidadeLimite'],
                required: false
            }
        ];

        const temFiltro = Object.keys(where).length > 0;

        return { where, include, temFiltro };
    }

    async pesquisar(filtros) {
        const { where, include, temFiltro } = await this.montarFiltroPesquisa(filtros);

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
            where.data = { [Op.between]: [filtros.dataInicio, filtros.dataFim] };
        }

        const resultados = await db.RelatorioFluxoDiario.findAll({
            where: where,
            attributes: [
                'equipamentoId',
                [db.sequelize.cast(db.sequelize.fn('SUM', db.sequelize.col('total')), 'UNSIGNED'), 'totalFluxos']
            ],
            include: [
                {
                    model: db.Equipamento,
                    attributes: ['id', 'codigo', 'faixa']
                }
            ],
            group: ['RelatorioFluxoDiario.equipamentoId', 'Equipamento.id', 'Equipamento.codigo', 'Equipamento.faixa'],
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
