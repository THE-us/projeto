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

router.post(
    '/fluxos',
    wrapAsync(async (req, res) => {
        const { ids, formato, filtros } = req.body;
    
        const FluxoService = require('../services/app/fluxo.service');
        const EquipamentoService = require('../services/app/equipamento.service');
        const fluxoService = new FluxoService();
        const equipamentoService = new EquipamentoService();
        
        const fluxos = await fluxoService.model.findAll({
            where: { id: { [Op.in]: ids } },
            order: [['data', 'DESC'], ['hora', 'DESC']]
        });

        const idsEquipamentos = [...new Set(fluxos.map(f => f.equipamentoId).filter(id => id))];
        let equipamentosMap = {};
        
        if (idsEquipamentos.length > 0) {
            const equipamentos = await equipamentoService.model.findAll({
                where: { id: { [Op.in]: idsEquipamentos } }
            });
            equipamentos.forEach(eq => {
                equipamentosMap[eq.id] = { codigo: eq.codigo, faixa: eq.faixa };
            });
        }

        const colunas = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Data', key: 'data', width: 15 },
            { header: 'Hora', key: 'hora', width: 12 },
            { header: 'Placa', key: 'placa', width: 15 },
            { header: 'Velocidade', key: 'velMed', width: 15 },
            { header: 'Classe', key: 'classVeic', width: 10 },
            { header: 'Cód. Equip.', key: 'codigoEquipamento', width: 20 },
            { header: 'Faixa', key: 'faixa', width: 10 }
        ];

        const dadosMapeados = fluxos.map(f => {
            let dataFormatada = f.data;
            if (f.data && typeof f.data !== 'string') {
                const dia = String(f.data.getDate()).padStart(2, '0');
                const mes = String(f.data.getMonth() + 1).padStart(2, '0');
                dataFormatada = `${dia}/${mes}/${f.data.getFullYear()}`;
            } else if (typeof f.data === 'string' && f.data.includes('-')) {
                const parts = f.data.split('-');
                dataFormatada = `${parts[2]}/${parts[1]}/${parts[0]}`;
            }

            const equip = equipamentosMap[f.equipamentoId];

            return {
                id: f.id,
                data: dataFormatada,
                hora: f.hora,
                placa: f.placa,
                velMed: `${f.velMed} km/h`,
                classVeic: f.classVeic,
                codigoEquipamento: equip ? equip.codigo : (f.equipamentoId || '-'),
                faixa: equip ? equip.faixa : '-'
            };
        });

        const exportacaoService = new ExportacaoService();
        if (formato === 'xlsx') {
            await exportacaoService.gerarExcel('Fluxos', colunas, dadosMapeados, filtros, res);
        } else {
            await exportacaoService.gerarPdf('Fluxos', colunas, dadosMapeados, filtros, res);
        }
    })
);

module.exports = router;