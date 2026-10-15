'use strict';
const{
    router,
    wrapAsync,
    sqFilter,
    findAll
} = require('../bases/base-controller')();
const MunicipioService = require('../services/app/municipio.service');

router.get(
    '/',
    sqFilter(),
    wrapAsync(async (req, res) => {
        await findAll(req, res, MunicipioService);
    })
);

module.exports = router;