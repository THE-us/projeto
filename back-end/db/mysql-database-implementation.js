'use strict';
const mysql = require('mysql2/promise');
const DefaultDatabaseImplementation = require('./default-database-implementation');

class MySQLDatabaseImplementation extends DefaultDatabaseImplementation{
    constructor(){
        super();
    }

    async _createDatabase(config){
        if(config.dialect === 'mysql'){
            const {host, port, username, password, database} = config;
            const connection = await mysql.createConnection({host, port, user:username, password});
            await connection.query(`CREATE DATABASE IF NOT EXISTS \` ${database}\`;`);
            await connection.close();
        }else{
            throw new Error(`Dialeto não suportado para criação de databse: ${config.dialect}`);
        }
    }

    async _dropDatabase(config){
        if(config.dialect === 'mysql'){
            const {host, port, username, password, database} = config;
            const connection = await mysql.createConnection({host, port, user:username, password});
            await connection.query(`DROP DATABASE IF EXISTS \`${database}\`;`);
            await connection.close();
        }else{
            throw new Error(`Dialeto não suportado para criação de database: ${config.dialect}`);
        }
    }
}

module.exports = MySQLDatabaseImplementation;