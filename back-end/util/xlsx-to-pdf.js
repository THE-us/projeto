'use strict';
const { execFile } = require('child_process');
const path = require('path');
const AppError = require('../errors/app-error');
const SOFFICE_BIN = 'C:\\Program Files\\LibreOffice\\program\\soffice.exe';

function converterXlsxParaPdf(pathXlsx, dirSaida) {
  return new Promise((resolve, reject) => {
    execFile(
      SOFFICE_BIN,
      ['--headless', '--convert-to', 'pdf', '--outdir', dirSaida, pathXlsx],
      { timeout: 60000 },
      (error) => {
        if (error) {
          if (error.code === 'ENOENT') {
            return reject(
              new AppError(
                'Conversão para PDF indisponível: LibreOffice não está instalado ou o caminho está incorreto.',
                500,
                'AppError',
                true
              )
            );
          }
          return reject(
            new AppError(`Falha ao converter relatório para PDF: ${error.message}`, 500, 'AppError', true)
          );
        }

        const nomeBase = path.basename(pathXlsx, path.extname(pathXlsx));
        const pathPdf = path.join(dirSaida, `${nomeBase}.pdf`);
        resolve(pathPdf);
      }
    );
  });
}

module.exports = { converterXlsxParaPdf };