const { resourceLimits } = require('node:worker_threads');
const models = require('../models');
const {Op} = require('sequelize');

function pesquisar(req, res){
    const where = {};

    if(req.query.dataInicio && req.query.dataFim){
        where.data = {
            [Op.between]: [req.query.dataInicio, req.query.dataFim]
        }
    }

    if(req.query.horaInicio && req.query.horaFim){
        where.hora = {
            [Op.between]: [req.query.horaInicio, req.query.horaFim]
        }
    }

    if(req.query.placa) where.placa = req.query.placa;
    if(req.query.equipamentoId) where.equipamentoId = req.query.equipamentoId;

    const temFiltro = Object.keys(where).length > 0;

    if(!temFiltro){
        return res.status(400).json({
            message: "INFORME PELO MENOS UM FILTRO"
        });
    }

    models.Fluxo.findAll({
        where: where,
        limit: 30,
        
        include: [
            {
                model: models.Equipamento,
                attributes: ['id', 'codigo', 'faixa']
            }
        ]
    }).then(result => {
        return res.status(200).json(result);
    }).catch(error => {
        return res.status(500).json({
            message: "ERRO AO PESQUISAR FLUXOS",
            error: error
        });
    });
}

function analisar(req, res){
    const where = {};

    if(req.query.dataInicio && req.query.dataFim){
        where.data = {
            [Op.between]: [req.query.dataInicio, req.query.dataFim]
        }
    }

    models.Fluxo.findAll({
        where: where,
        attributes: [
            'equipamentoId', [models.sequelize.fn('COUNT', models.sequelize.col('Fluxo.id')), 'totalFluxos']
        ],
        group: ['equipamentoId'],
        
        include: [
            {
                model: models.Equipamento,
                attributes: ['id', 'codigo', 'faixa']
            }
        ]
    }).then(result => {
        return res.status(200).json(result);
    }).catch(error => {
        return res.status(500).json({
            message: "ERRO AO ANALISAR FLUXOS",
            error: error
        });
    });
}

module.exports = {
    pesquisar: pesquisar,
    analisar: analisar
}