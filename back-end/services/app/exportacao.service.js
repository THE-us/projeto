'use strict';
const ExcelJS = require('exceljs');
const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');
const uuid = require('uuid');
const { converterXlsxParaPdf } = require('../../util/xlsx-to-pdf');

class ExportacaoService {
    async montarWorkbook(nomePlanilha, colunas, dados, filtros) {
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
        if (!temFiltro) { worksheet.addRow(['Nenhum filtro aplicado (Todos os registos)']); }
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

        return workbook;
    }

    async gerarExcel(nomePlanilha, colunas, dados, filtros, res) {
        const workbook = await this.montarWorkbook(nomePlanilha, colunas, dados, filtros);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${nomePlanilha.toLowerCase()}_exportados.xlsx`);
        
        await workbook.xlsx.write(res);
        res.end();
    }

    async gerarPdf(nomePlanilha, colunas, dados, filtros, res) {
        const workbook = await this.montarWorkbook(nomePlanilha, colunas, dados, filtros);
        
        const dirTmp = path.join(__dirname, '../../../tmp/relatorios');
        if (!fs.existsSync(dirTmp)) {
            fs.mkdirSync(dirTmp, { recursive: true });
        }

        const idRelatorio = uuid.v4();
        const pathXlsx = path.join(dirTmp, `${idRelatorio}.xlsx`);
        let pathPdf = null;

        try {
            await workbook.xlsx.writeFile(pathXlsx);
            
            pathPdf = await converterXlsxParaPdf(pathXlsx, dirTmp);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${nomePlanilha.toLowerCase()}_exportados.pdf`);
            
            const fileStream = fs.createReadStream(pathPdf);
            fileStream.pipe(res);
            
            fileStream.on('close', async () => {
                await fsPromises.unlink(pathXlsx).catch(() => {});
                if (pathPdf) await fsPromises.unlink(pathPdf).catch(() => {});
            });

        } catch (error) {
            console.error('Erro na geração do PDF:', error);
            if (!res.headersSent) {
                res.status(500).json({ 
                    message: 'Erro ao gerar o PDF. Verifique se o LibreOffice está instalado.', 
                    erro: error.message 
                });
            }
            await fsPromises.unlink(pathXlsx).catch(() => {});
            if (pathPdf) await fsPromises.unlink(pathPdf).catch(() => {});
        }
    }
}

module.exports = ExportacaoService;