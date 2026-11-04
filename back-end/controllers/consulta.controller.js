'use strict';
const{
    router,
    wrapAsync,
    sqFilter,
    validateSchema,
    getSchema,
    matchedBody,
    Response
} =  require('../bases/base-controller')();
const auth = require('../services/auth.service');
const ConsultaService = require('../services/app/consulta.service');

router.get(
    '/pesquisarpassagens',
    sqFilter(),
    wrapAsync(async (req, res) => {
        const service = new ConsultaService();
        const response = await service.pesquisarPassagens(req.filter);
        Response.ok(res, response);
    })
);

router.get(
    '/pesquisarpassagens/count',
    sqFilter(),
    wrapAsync(async (req, res) => {
        const service = new ConsultaService();
        const count = await service.countPesquisarPassagens(req.filter);
        Response.ok(res, { count });
    })
);

module.exports = router;