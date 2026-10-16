'use strict';
const{
    router,
    wrapAsync,
} = require('../bases/base-controller')();
const FluxoService = require('../services/app/fluxo.service');
const { Response } = require('../bases/base-controller')();

router.get(
    '/pesquisa',
    wrapAsync(async (req, res) => {
        const service = new FluxoService();
        const dados = await service.pesquisar(req.query);
        Response.ok(res, dados);
    })
);

router.get(
    '/analisar',
    wrapAsync(async (req, res) => {
        const service = new FluxoService();
        const dados = await service.analisar(req.query);
        Response.ok(res, dados);
    })
);

module.exports = router;