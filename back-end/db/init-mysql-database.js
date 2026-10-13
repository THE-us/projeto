const MySQLDatabaseImplementation = require('./mysql-database-implementation');
const database = require('./database');

const mysqlDatabaseImplementation = new MySQLDatabaseImplementation();
database.setDatabaseImplementation(mysqlDatabaseImplementation);

module.exports = database;
