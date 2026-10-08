'use strict';

const authService = require('../services/auth.service');
const config = require('../config/config')

const { router, Response, wrapAsync, validateSchema, getSchema, matchedBody } = require('../bases/base-controller')();

const senhaSchemaField = {
    in: ['body'],
    isLength:{
        options: {min: 6, max: 15},
    },
};

const loginSchema = {
    login:{
        in:['body'],
        isLength:{
            options:{min: 1, max: 255},
        },
        trim: true,
    },
    senha: senhaSchemaField,
};

const refreshSchema = {
    accessToken:{
        in:['body'],
        isString: true,
    },
    refreshToken:{
        in:['body'],
        isString:true,
    },
};

router.post(
    '/login',
    validateSchema(getSchema(loginSchema)),
    matchedBody(),
    wrapAsync(async (req, res) => {
        const credentials = req.matchedBody;
        const response = await authService.login(credentials);
        Response.ok(req, response);
    })
);

router.post(
    '/refresh',
    validateSchema(getSchema(refreshSchema)),
    matchedBody(),
    wrapAsync(async (req, res) => {
        const tokens = req.matchedBody;
        const response = await authService.refresh(tokens);
        Response.ok(req, response);
    })
);

router.post(
    '/changepassword',
    authService.jwtAuthorize(),
    validateSchema({
        senhaAntiga: senhaSchemaField,
        senhaNova: senhaSchemaField,
    }),
    matchedBody(),
    wrapAsync(async (req, res) => {
        const password = req.matchedBody;
        const response = await authService.changePassword(password, req.user);
        Response.ok(req, response);
    })
);

module.exports = router;