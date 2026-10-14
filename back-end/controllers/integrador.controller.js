'use strict';
const{
    router,
    wrapAsync,
    sqFilter,
    findAll
} = require('../bases/base-controller')();
const IntegradorService = require('../services/app/integrador.service');

router.get(
    '/',
    sqFilter(),
    wrapAsync(async (req, res) => {
        console.log('ENTROU AQUI');

        const service = new IntegradorService();

        await service.puxarTodos(req, res);
    })
);

module.exports = router;