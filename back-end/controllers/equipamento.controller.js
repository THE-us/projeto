'use strict';
const{
    router,
    wrapAsync,
    sqFilter,
    findAll,
    create,
    updateById,
    deletedById,
    getSchema
} = require('../bases/base-controller')();
const EquipamentoService = require('../services/app/equipamento.service');
const { validateSchema, matchedBody, validateParamIdAsIntAndSanitize } = require('../util/validations');
const { findById } = require('../bases/base-model');
const { Response } = require('../bases/base-controller')();

const schema = {
    codigo:{ in: ['body'], isLength:{ options: {min: 1, max: 11}, }, },
    faixa:{ in: ['body'], },
    tipo:{ in: ['body'], },
    ativo:{ in: ['body'], },
    local:{ in: ['body'], },
    marca:{ in: ['body'], },
    modelo:{ in: ['body'], },
    velocidadeLimite:{ in: ['body'], },
    dataAfericao:{ in: ['body'], },
    lacre:{ in: ['body'], },
    dataRegistroInmetro:{ in: ['body'], },
    numeroInmetro:{ in: ['body'], },
    integradorId:{ in: ['body'], },
    municipioId:{ in: ['body'], },
};

router.post('/cadastrar', validateSchema(getSchema(schema)), matchedBody(), wrapAsync(async (req, res) => {
    await create(req, res, EquipamentoService);
}));

router.post('/:id', validateParamIdAsIntAndSanitize(), validateSchema(getSchema(schema)), matchedBody(), wrapAsync(async (req, res) => {
    const { id } = req.params;
    const value = req.matchedBody || req.body;
    const service = new EquipamentoService();
    const instance = await service.updateById(id, value);
    Response.ok(res, instance);
}));

router.delete('/:id', validateParamIdAsIntAndSanitize(), wrapAsync(async (req, res) => {
    const { id } = req.params;
    const service = new EquipamentoService();
    const deleted = await service.deleteByIdOrThrowError(id); 
    Response.ok(res, { deleted });
}));

router.get('/', sqFilter(), wrapAsync(async (req, res) => {
    const { pagina = 1, limite = 10 } = req.query;

    const limit = parseInt(limite) || 10;
    const page = parseInt(pagina) || 1;
    const offset = (page - 1) * limit;

    const service = new EquipamentoService();
    const { where, include } = service.montarFiltroPesquisa(req.query);

    const equipamentos = await service.model.findAndCountAll({
        where: where,
        include: include,
        limit: limit,
        offset: offset,
        order: [['createdAt', 'DESC']]
    });

    Response.ok(res, {
        dados: equipamentos.rows,
        totalRegistros: equipamentos.count,
        paginaAtual: page,
        totalPaginas: Math.ceil(equipamentos.count / limit)
    });
}));

router.get('/:id', validateParamIdAsIntAndSanitize(), sqFilter(), wrapAsync(async (req, res) => {
    const { id } = req.params;
    const service = new EquipamentoService();
    const instance = await service.findByIdOrThrowError(id);
    Response.ok(res, instance);
}));

module.exports = router;