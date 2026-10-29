'use strict';
const{
    router,
    wrapAsync,
    sqFilter,
    findAll,
    count,
    findById,
    findOne,
    create,
    updatedById,
    deleteById,
    validateParamIdAsIntAndSanitize,
    validateSchema,
    getSchema,
    matchedBody,
    Response
} = require('../bases/base-controller')();
const auth = require('../services/auth.service');
const UsuarioService = require('../services/app/usuario.service');
const { body } = require('express-validator');

const schemaSenha = {
    in: ['body'],
    isLength: {
        options: {min: 6, max: 15},
    },
};

const schema = {
    login: {
        in: ['body'],
        isLength: {
            options: {min: 3, max: 30},
        },
    },
    senha: schemaSenha,
    nome: {
        in: ['body'],
        isLength: {
            options: {min: 1, max: 100},
        },
    },
    ativo: {
        in: ['body'],
        isBoolean: true,
    },
};

router.get(
    '/',
    sqFilter(),
    wrapAsync(async (req, res) => {
        await findAll(req, res, UsuarioService, req.user.perfil);
    })
);

router.get(
    '/:id',
    validateParamIdAsIntAndSanitize(),
    sqFilter(),
    wrapAsync(async (req, res) => {
        await findById(req, res, UsuarioService, req.user.perfil);
    })
);

router.post(
    '/',
    // Passamos o array auth.authenticated() para garantir que apenas um usuário logado pode cadastrar outro (a menos que a sua regra de negócio permita qualquer um).
    // Se no seu projeto base for aberto para criar o 1º admin, remova o auth.authenticated()
    //uth.authenticated(),
    validateSchema(getSchema(schema)),
    matchedBody(),
    wrapAsync(async (req, res) => {
        console.log('REQUISICAO SIGN-UP');
        // Validamos se o login já existe usando o serviço
        const service = new UsuarioService();
        await service.validateCreate(req.matchedBody.login);
        
        // Passamos os dados limpos e validados diretamente para a função genérica create
        await create(req, res, UsuarioService);
    })
);

router.put(
    '/:id',
    validateParamIdAsIntAndSanitize(),
    validateSchema(getSchema(schema, {exclude: ['senha']})),
    matchedBody(),
    wrapAsync(async (req, res) => {
        await updatedById(req, res, UsuarioService, req.user.perfil);
    })
);

router.put(
    '/:id/alterarsenha',
    validateParamIdAsIntAndSanitize(),
    validateSchema({
        senha: schemaSenha,
    }),
    matchedBody(),
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const values = req. matchedBody;
        const service = new UsuarioService(req.user.perfil);
        await service.alterarSenha(id, values);
        Response.end(res, 204);
    })
);

router.delete(
    '/:id',
    validateParamIdAsIntAndSanitize(),
    wrapAsync(async (req, res) => {
        await deleteById(req, res, UsuarioService, req.user.perfil);
    })
);

module.exports = router;