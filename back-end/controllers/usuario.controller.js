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

const schemaLogin = {
    login: {
        in: ['body'],
        isLength:{
            options: {min: 3, max: 30}
        },
    },
    nome: {
        in: ['body'],
        isLength:{
            options: {min: 1, max: 100},
        },
    },
    senha: schemaSenha,
}

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
    validateSchema(getSchema(schema)),
    matchedBody(),
    wrapAsync(async (req, res) => {
        console.log('REQUISICAO SIGN-UP');
        console.log('req.mathedBody: ', req.matchedBody);

        const {login, nome, senha} =  req.matchedBody;
        const service = new UsuarioService();

        console.log('INFORMACOES PASSADAS PARA SIGN-UP: ', login, nome, senha);

        await service.validateCreate(login, nome, senha);

        console.log('Resposta de validateCreate: ', service.validateCreate());

        await create(req, res, UsuarioService, body);
    })
);

router.post(
    '/login',
    validateSchema(getSchema(schemaLogin)),
    matchedBody(),
    wrapAsync(async(req, res) => {
        console.log('REQUISIÇÃO');
        console.log('req.matchedBody: ', req.matchedBody);

        const { login, nome, senha } = req.matchedBody;
        const service = new UsuarioService();

        console.log('Tentando autenticar usuário: ', login);

        const usuario = await service.authenticate(login, nome, senha);

        console.log('Resultado retornado pelo service.authenticate: ', usuario);

        if (!usuario) {
            return res.status(401).json({ error: 'Login ou senha inválidos' });
        }

        Response.ok(res, usuario);
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