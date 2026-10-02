const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Validator = require('fastest-validator');
const { where } = require('sequelize');

function signUp(req, res){
    const schema = {
        login: {type: "string", optional: false, max: 30},
        senha: {type: "string", optional: false},
        nome: {type: "string", optional: false, max: 100},
        ativo: {type: "number", optional: false}
    }

    const v = new Validator();
    const validarUsuario = v.validate(req.body, schema);
    if(validarUsuario !== true){
        return res.status(400).json({
            message: "DADOS NÃO COMPATIVEIS",
            error: validarUsuario
        });
    }

    models.Usuario.findOne({where:{login:req.body.login}}).then(result => {
        if(result){
            res.status(409).json({
                message: "LOGIN JÁ EXISTEM"
            });
        }

        bcryptjs.genSalt(10, function(err, salt){
            bcryptjs.hash(req.body.senha, salt, function(err, hash){
                const usuario = {
                    login: req.body.login,
                    senha: hash,
                    nome: req.body.nome,
                    ativo: req.body.ativo
                }

                models.Usuario.create(usuario).then(result => {
                    return res.status(201).json({
                        message: "USUARIO CRIADO COM SUCESSO",
                        usuario: {login: result.login, nome: result.nome, ativo: result.ativo}
                    });
                }).catch(error => {
                    return res.status(500).json({
                        message: "ERRO AO CRIAR USUARIO",
                        error: error
                    });
                });
            });
        });
    }).catch(error => {
        return res.status(500).json({
            message: "ERRO AO VERIFICAR LOGIN",
            error: error
        });
    });
}

function logIn(req, res){
    const schema = {
        login: {type: "string", optional: false, max: 30},
        senha: {type: "string", optional: false}
    }

    const v = new Validator();
    const validarLogin = v.validate(req.body, schema);

    if(validarLogin !== true){
        return res.status(400).json({
            message: "DADOS INVALIDOS",
            error: validarLogin
        });
    }

    models.Usuario.findOne({where: {login: req.body.login}}).then(usuario => {
        if(usuario === null){
            return res.status(401).json({
                message: "CREDENCIAIS INVALIDAS"
            });
        }

        if(usuario.ativo !== 1){
            return res.status(401).json({
                message: "USUARIO INATIVO"
            });
        }

        bcryptjs.compare(req.body.senha, usuario.senha, function(err, result){
            if(result){
                const token = jwt.sign({
                    login: usuario.login,
                    usuarioId: usuario.id
                }, process.env.JWT_KEY);

                return res.status(200).json({
                    message: "AUTENTICACAO REALIZADA COM SUCESSO",
                    token: token
                });
            }else{
                return res.status(401).json({
                    message: "CREDENCIAIS INVALIDAS"
                });
            }
        });
    }).catch(error => {
        return res.status(500).json({
            message: "ERRO AO REALIZAR LOGIN",
            error: error
        });
    });
}

module.exports = {signUp, logIn};