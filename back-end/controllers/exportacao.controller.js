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
        
        const database = require('../../db/database');
        const db = database.getDatabase();
        
        // 1. Busca os fluxos marcados e os Equipamentos relacionados (para ter o código)
        const fluxos = await db.Fluxo.findAll({
            where: { id: { [Op.in]: ids } },
            include: [{ model: db.Equipamento, as: 'Equipamento' }],
            order: [['data', 'DESC'], ['hora', 'DESC']]
        });

        // 2. Colunas da Tabela Excel/PDF
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

        // 3. Mapear os dados para ficar formatado igual ao HTML
        const dadosMapeados = fluxos.map(f => {
            // Formatar a data (ex: 2026-10-27 -> 27/10/2026)
            let dataFormatada = f.data;
            if (f.data && typeof f.data !== 'string') {
                const dia = String(f.data.getDate()).padStart(2, '0');
                const mes = String(f.data.getMonth() + 1).padStart(2, '0');
                dataFormatada = `${dia}/${mes}/${f.data.getFullYear()}`;
            } else if (typeof f.data === 'string' && f.data.includes('-')) {
                const parts = f.data.split('-');
                dataFormatada = `${parts[2]}/${parts[1]}/${parts[0]}`;
            }

            return {
                id: f.id,
                data: dataFormatada,
                hora: f.hora,
                placa: f.placa,
                velMed: `${f.velMed} km/h`,
                classVeic: f.classVeic,
                codigoEquipamento: f.Equipamento ? f.Equipamento.codigo : f.equipamentoId,
                faixa: f.Equipamento ? f.Equipamento.faixa : '-'
            };
        });

        // 4. Manda pro Motor do ExcelJS (já adaptado para ler qualquer filtro)!
        const exportacaoService = new ExportacaoService();
        if (formato === 'xlsx') {
            await exportacaoService.gerarExcel('Fluxos', colunas, dadosMapeados, filtros, res);
        } else {
            await exportacaoService.gerarPdf('Fluxos', colunas, dadosMapeados, filtros, res);
        }
    })
);

module.exports = router;