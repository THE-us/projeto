'use strict';
const ExcelJS = require('exceljs');

class ExportacaoService {
    async gerarExcel(nomePlanilha, colunas, dados, filtros, res) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(nomePlanilha);

        worksheet.addRow(['Filtros aplicados na pesquisa:']).font = { bold: true, size: 12 };
        
        let temFiltro = false;
        if (filtros) {
            if (filtros.codigo) { worksheet.addRow(['Código:', filtros.codigo]); temFiltro = true; }
            if (filtros.faixa) { worksheet.addRow(['Faixa:', filtros.faixa]); temFiltro = true; }
            if (filtros.integradorNome) { worksheet.addRow(['Integrador:', filtros.integradorNome]); temFiltro = true; }
            if (filtros.ativo !== undefined && filtros.ativo !== null) { 
                worksheet.addRow(['Status:', filtros.ativo === 1 ? 'Ativo' : 'Inativo']); 
                temFiltro = true; 
            }
        }
        
        if (!temFiltro) {
            worksheet.addRow(['Nenhum filtro aplicado (Todos os registos)']);
        }
        
        worksheet.addRow([]);

        const headerRow = worksheet.addRow(colunas.map(c => c.header));
        headerRow.font = { bold: true };
        headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };

        colunas.forEach((col, index) => {
            worksheet.getColumn(index + 1).width = col.width;
        });

        dados.forEach(dado => {
            worksheet.addRow(colunas.map(col => dado[col.key]));
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${nomePlanilha.toLowerCase()}_exportados.xlsx`);
        
        await workbook.xlsx.write(res);
        res.end();
    }

    async gerarPdf(nomePlanilha, colunas, dados, filtros, res) {
        // Placeholder: vamos implementar o LibreOffice assim que validar o Excel!
        res.status(501).json({ message: 'Conversão PDF em desenvolvimento.' });
    }
}

module.exports = ExportacaoService;