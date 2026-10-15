'use strict';
const BaseCrudService = require('../../bases/base-crud-service');
const database = require('../../db/database');

class IntegradorService extends BaseCrudService {
    constructor() {
        // 1. Pegamos o objeto completo do banco de dados
        const db = database.getDatabase();
        
        // 2. DEBUG: Vamos imprimir no terminal tudo o que o banco de dados carregou
        console.log("=== DEBUG DA API ===");
        console.log("1. Modelos disponíveis no banco:", Object.keys(db));
        console.log("2. O modelo Integrador existe aqui dentro?:", db.Integrador ? "SIM" : "NÃO");
        console.log("====================");

        // 3. Passamos apenas o modelo correto para o BaseCrudService, 
        // ou disparamos um erro claro se ele não existir
        if (!db.Integrador) {
            throw new Error("O modelo db.Integrador está undefined! Verifique se o arquivo do model está exportando o nome corretamente.");
        }

        super(db.Integrador);
    }
}

module.exports = IntegradorService;