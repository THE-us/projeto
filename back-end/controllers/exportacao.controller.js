'use strict';
const { router, wrapAsync } = require('../bases/base-controller')();
const ExportacaoService = require('../services/app/exportacao.service');
const EquipamentoService = require('../services/app/equipamento.service');
const { Op } = require('sequelize');

router.post(
    '/equipamentos',
    wrapAsync(async (req, res) => {
        const { ids, formato, filtros } = req.body;
        
        const eqService = new EquipamentoService();
        const equipamentos = await eqService.model.findAll({
            where: { id: { [Op.in]: ids } },
            order: [['codigo', 'ASC']]
        });

        const colunas = [
            { header: 'Código', key: 'codigo', width: 15 },
            { header: 'Marca / Modelo', key: 'marcaModelo', width: 30 },
            { header: 'Tipo', key: 'tipo', width: 10 },
            { header: 'Faixa', key: 'faixa', width: 10 },
            { header: 'Local', key: 'local', width: 35 },
            { header: 'Status', key: 'status', width: 15 }
        ];

        const dadosMapeados = equipamentos.map(eq => ({
            codigo: eq.codigo,
            marcaModelo: `${eq.marca || ''} / ${eq.modelo || ''}`.trim(),
            tipo: eq.tipo,
            faixa: eq.faixa,
            local: eq.local,
            status: eq.ativo ? 'Ativo' : 'Inativo'
        }));

        const exportacaoService = new ExportacaoService();
        if (formato === 'xlsx') {
            await exportacaoService.gerarExcel('Equipamentos', colunas, dadosMapeados, filtros, res);
        } else {
            await exportacaoService.gerarPdf('Equipamentos', colunas, dadosMapeados, filtros, res);
        }
    })
);

module.exports = router;