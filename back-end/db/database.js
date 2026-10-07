'use strict';

class Database{
    constructor() {
        this.databaseImplementation = undefined;
    }

    setDatabaseImplementation(databaseImplementation){
        if(this.databaseImplementation){
            throw new Error('DatabaseImplementation is already configured for the Database');
        }
        this.databaseImplementation = databaseImplementation;
    }

    getDatabase(){
        return this.databaseImplementation.getDatabase();
    }

    async createdDatabase(){
        return this.databaseImplementation.createdDatabase();
    }

    async dropDatabase(){
        return this.databaseImplementation.dropDatabase();
    }

    async syncDatabase(options){
        return this.databaseImplementation.syncDatabase(options);
    }

    async dropTablesDatabase(options){
        return this.databaseImplementation.dropTableDatabase(options);
    }

    async initDatabase(){
        return this.databaseImplementation.initDatabase();
    }

    async executeSeedsUpDatabase(){
        return this.databaseImplementation.executeSeedsUpDatabase();
    }

    async executeSeedsDownDatabase(){
        return this.databaseImplementation.executeSeedsDownDatabase();
    }

    async closeConnectionDatabase(){
        return this.databaseImplementation.closeConnectionDatabase();
    }
}

const database = new Database();
module.exports = database;