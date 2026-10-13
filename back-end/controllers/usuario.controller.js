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
            options: {min: 3, max: 30},
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
        await create(req, res, UsuarioService, body);
    })
);

router.post(
    '/login',
    validateSchema(getSchema(schemaLogin)),
    matchedBody(),
    wrapAsync(async(req, res) => {
        const { login, senha } = req.matchedBody;
        const service = new UsuarioService();

        const usuario = await service.authenticate(login, senha);
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