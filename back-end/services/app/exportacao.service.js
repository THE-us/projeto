'use strict';
const ExcelJS = require('exceljs');

class ExportacaoService {
    async gerarExcel(nomePlanilha, colunas, dados, res) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(nomePlanilha);

        worksheet.columns = colunas;

        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };

        dados.forEach(dado => worksheet.addRow(dado));

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${nomePlanilha.toLowerCase()}_exportados.xlsx`);
        
        await workbook.xlsx.write(res);
        res.end();
    }

    async gerarPdf(nomePlanilha, colunas, dados, res) {
        res.status(501).json({ message: 'Conversão PDF em desenvolvimento.' });
    }
}

module.exports = ExportacaoService;