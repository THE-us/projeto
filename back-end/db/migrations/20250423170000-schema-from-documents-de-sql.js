'use strict';

const fs = require('fs');
const path = require('path');

const SQL_DIR = path.join(__dirname, '../sql-criacao');

const DUMP_TABLE_END = '/*!40101 SET character_set_client = @saved_cs_client */;';

const SQL_FILES = [
    'gctweb_der_mg_fluxo_Fluxo.sql',
];

function extractTableDd1(fullText){
    const drop = 'DROP TABLE IF EXISTS';
    const start = fulltext.indexOf(drop);

    if(start === -1){
        throw new Error('DROP TABLE IF EXISTS não encontrado no dump');
    }

    const end = fullText.indexOf(DUMP_TABLE_END, start);
    if(end === -1){
        throw new Error('Marcador final do mysqldump não encontrado');
    }

    return fullText.slice(start, end + DUMP_TABLE_END.length);
}

function sanitizeMysqldumpDd1(ddl){
    return ddl
        .split('\n')
        .filter((line) => {
            const t = line.trim();

            if(!t){
                return false;
            }
            if (/^\/\*!40101 SET @saved_cs_client/i.test(t)) {
                return false;
            }
            if (/^\/\*!50503 SET character_set_client = utf8mb4/i.test(t)) {
                return false;
            }
            if (/^\/\*!40101 SET character_set_client = @saved_cs_client/i.test(t)) {
                return false;
            }
            return true;
        })
        .join('\n')
        .trim();
}

function splitDropAndCreate(sanitized){
    const idx = sanitized.search(/\bCREATE\s+TABLE\b/i);
    
    if(idx === -1){
        throw new Error('CREATE TABLE não encontrado após sanitizar');
    }

    const dropSql = sanitized.slice(0, idx).trim();
    const createSql = sanitized.slice(idx).trim();

    if(!/^DROP\s+TABLE/i.test(dropSql)){
        throw new Error('Trecho DROP TABLE esperado antes de CREATE TABLE');
    }

    return [dropSql, createSql];
}

function tableNameFromFile(file){
    return file.replace(/^gctweb_der_mg_fluxo_/, '').replace(/\.sql$/i, '');
}

module.exports = {
    async up(queryInterface){
        const { sequelize } = queryInterface;

        if(!fs.existsSync(SQL_DIR)){
            throw new Error(
                `Pasta de SQL não encontrado: ${SQL_DIR}. Coloque os dumps em backend/db/sql-criacao/.`
            );
        }

        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await sequelize.query("SET SESSION sql_mode = 'NO_AUTO_VALUE_ON_ZERO'");

        for(const file of SQL_FILES){
            const fp = path.join(SQL_DIR, file);
            if(!fs.existsSync(fp)){
                throw new Error(`Arquivo de estrutura ausente: ${fp}`);
            }

            let raw = extractTableDdl(fs.readFileSync(fp, 'utf8'));
            let ddl = sanitizeMysqldumpDdl(raw);

            if(file === 'gctweb_der_mg_fluxo_Fluxo.sql'){
                ddl = adaptFluxoTableDdl(ddl);
            }

            const [dropSql, createSql] = splitDropAndCreate(ddl);
            await sequelize.query(dropSql);
            await sequelize.query(createSql);
        }

        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    },

    async down(queryInterface){
        const { sequelize } = queryInterface;
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

        const reversed = [...SQL_FILES].reverse();

        for(const file of reversed){
            const name = tableNameFromFile(file);
            await sequelize.query(`DROP TABLE IF EXISTS \`${name}\``);
        }

        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    },
};