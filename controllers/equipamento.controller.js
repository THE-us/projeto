const models =    require('../models');
const Validator = require('fastest-validator');

function cadastrar(req, res){
    const equipamento = {
        codigo:                           req.body.codigo,
        faixa:                             req.body.faixa,
        tipo:                               req.body.tipo,
        ativo:                             req.body.ativo,
        local:                             req.body.local,
        marca:                             req.body.marca,
        modelo:                           req.body.modelo,
        velocidadeLimite:       req.body.velocidadeLimite,
        dataAfericao:               req.body.dataAfericao,
        lacre:                             req.body.lacre,
        dataRegistroInmetro: req.body.dataRegistroInmetro,
        numeroInmetro:             req.body.numeroInmetro,
        integradorId:               req.body.integradorId,
        municipioId:                 req.body.municipioId
    }

    const schema = {
        codigo:        {type: "string", optional: "false", max: 11},
        faixa:                  {type: "number", optional: "false"},
        tipo:                   {type: "string", optional: "false"},
        ativo:                  {type: "number", optional: "false"},
        local:         {type: "string", optional: "false", max: 80},
        marca:         {type: "string", optional: "false", max: 40},
        modelo:        {type: "string", optional: "false", max: 40},
        velocidadeLimite:       {type: "number", optional: "false"},
        dataAfericao:           {type: "string", optional: "false"},
        lacre:         {type: "string", optional: "false", max: 20},
        dataRegistroInmetro:     {type: "string", optional: "true"},
        numeroInmetro:    {type: "string", optional: true, max: 30},
        integradorId:           {type: "number", optional: "false"},
        municipioId:            {type: "number", optional: "false"}
    }

    const v = new Validator();
    const validarCadsEquip = v.validate(equipamento, schema);

    if(validarCadsEquip !== true){
        return res.status(400).json({
            message: "ERRO EM DADOS INFORMADOS",
            errors: validarCadsEquip
        })
    }else{
        models.Municipio.findByPk(req.body.municipioId).then(result => {
            if(result !== null){
                models.Equipamento.create(equipamento).then(result => {
                    res.status(201).json({
                        message: "EQUIPAMENTO CADASTRADO COM SUCESSO",
                        post: result
                    });
                }).catch(error => {
                    res.status(500).json({
                        message: "ERROR EM CADASTRAR EQUIPAMENTO",
                        error: error
                    });
                });
            }else{
                res.status(400).json({
                    message: "MUNICIPIO NÃO VALIDO"
                })
            }
        });
    }
}

function atualizar(req, res){
    const id = req.params.id;
    const atualizarEquipamento = {
        codigo:                           req.body.codigo,
        faixa:                             req.body.faixa,
        tipo:                               req.body.tipo,
        ativo:                             req.body.ativo,
        local:                             req.body.local,
        marca:                             req.body.marca,
        modelo:                           req.body.modelo,
        velocidadeLimite:       req.body.velocidadeLimite,
        dataAfericao:               req.body.dataAfericao,
        lacre:                             req.body.lacre,
        dataRegistroInmetro: req.body.dataRegistroInmetro,
        numeroInmetro:             req.body.numeroInmetro,
        integradorId:               req.body.integradorId,
        municipioId:                 req.body.municipioId
    }

    const schema = {
        codigo:        {type: "string", optional: "false", max: 11},
        faixa:                  {type: "number", optional: "false"},
        tipo:                   {type: "string", optional: "false"},
        ativo:                  {type: "number", optional: "false"},
        local:         {type: "string", optional: "false", max: 80},
        marca:         {type: "string", optional: "false", max: 40},
        modelo:        {type: "string", optional: "false", max: 40},
        velocidadeLimite:       {type: "number", optional: "false"},
        dataAfericao:           {type: "string", optional: "false"},
        lacre:         {type: "string", optional: "false", max: 20},
        dataRegistroInmetro:     {type: "string", optional: "true"},
        numeroInmetro:    {type: "string", optional: true, max: 30},
        integradorId:           {type: "number", optional: "false"},
        municipioId:            {type: "number", optional: "false"}
    }

    const v = new Validator();
    const validarAtulEquip = v.validate(atualizarEquipamento, schema);

    if(validarAtulEquip !== true){
        return res.status(400).json({
            message: "DADOS INVALIDADOS",
            errors: validarAtulEquip
        })
    }

    models.Municipio.findByPk(req.body.municipioId).then(result => {
        if(result !== null){
            models.Equipamento.create(atualizarEquipamento, {where: {id: id}}).then(result => {
                res.status(201).json({
                    message: "EQUIPAMENTO ATUALIZADO COM SUCESSO",
                    post: result
                });
            }).catch(error => {
                res.status(500).json({
                    message: "ERROR EM ATUALIZAR O EQUIPAMENTO",
                    error: error
                });
            });
        }else{
            res.status(400).json({
                message: "MUNICIPIO NÃO VALIDO"
            })
        }
    });
}

function deletar(req, res){
    const id = req.params.id;
    //const userId = req.userData.userId;

    models.Equipamento.destroy({where:{id: id}}).then(result => {
        if(result){
            res.status(200).json({
                message: "EQUIPAMENTO DELETADO",
                post: result
            })
        }else{
            res.status(404).json({
                message: "EQUIPAMENTO NÃO ENCONTRADO",
            })
        }
    }).catch(error => {
        res.status(500).json({
            message: "ERRO EM DELETAR EQUIPAMENTO",
            error: error
        })
    });
}

function index(req, res){
    models.Equipamento.findAll().then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(500).json({
            message: "ERRO EM PEGAR TODOS OS EQUIPAMENTOS"
        });
    })
}

module.exports = {
    cadastrar: cadastrar,
    atualizar: atualizar,
    deletar: deletar,
    index: index
}