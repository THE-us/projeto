'use strict';

const fs = require('fs');
const path = require('path');
const {Sequelize, Op} = require('sequelize');
const configDatabase = require('../config/config').database;
const cls = require('cls-hooked');
const DatabaseNotFoundError = require('../errors/database-not-found-error');

const namespace = cls.createNamespace('my-very-own-namespace');
Sequelize.useCLS(namespace);

const pathDatabaseModels = '../../../../../../../../Users/matheus.soares/me/edoc/Treinamento/projeto/back-end/models';

const operatorAliases = {
    $or: Op.or,
    $like: Op.like,
    $gte: Op.gte,
    $lte: Op.lte,
    $notIn: Op.notIn,
    $is: Op.is,
    $not: Op.not,
    $eq: Op.eq,
};
configDatabase.operatorAliases = operatorAliases;

class DefaultDatabaseImplementation{
    constructor(){
        this.db = undefined;
    }

    getDatabase(){
        if(!this.db){
            throw new DatabaseNotFoundError();
        }
        return this.db;
    }
  async createDatabase() {
    await this._createDatabase(configDatabase);
  }

  async dropDatabase() {
    const db = this.getDatabase();
    if (db) {
      await db.sequelize.close();
    }
    await this._dropDatabase(configDatabase);
  }

  async syncDatabase(options = { force: true }) {
    const db = this.getDatabase();
    await db.sequelize.sync(options);
  }

  async dropTablesDatabase(options = { force: true }) {
    const db = this.getDatabase();
    await db.sequelize.drop(options);
  }

  async initDatabase() {
    this.db = this._initDatabase(configDatabase, pathDatabaseModels);
    await this._verifyDatabaseConnection(this.db, ` ${configDatabase.database}`);
  }

  async executeSeedsUpDatabase() {
    const basepath = this._getSeedsBasepathDatabase();
    const db = this.getDatabase();
    await this._executeSeedsUp(db, basepath);
  }

  async executeSeedsDownDatabase() {
    const basepath = this._getSeedsBasepathDatabase();
    const db = this.getDatabase();
    await this._executeSeedsDown(db, basepath);
  }

  _getSeedsRelativePath() {
    const relativepath = process.env.DB_SEED_RELATIVE_PATH;
    if (!relativepath) {
      throw new Error('DB_SEED_RELATIVE_PATH não definido');
    }
    return relativepath;
  }

  _getSeedsBasepathDatabase() {
    const seedsRelativepath = this._getSeedsRelativePath();
    const basepath = path.resolve(__dirname, seedsRelativepath);
    return basepath;
  }

  _getRootpath() {
    const basepath = path.resolve(__dirname, '../../');
    return basepath;
  }

  async _verifyDatabaseConnection(db, dbName) {
    try {
      await db.sequelize.authenticate();
    } catch (error) {
    }
  }

  _initDatabase(config, basePath) {
    const rootpath = this._getRootpath();
    const db = {};
    const sequelize = new Sequelize(config);
    sequelize.addHook('beforeCreate', (values) => {
      values.updatedBy = values.createdBy;
    });

    fs.readdirSync(basePath)
      .filter((file) => {
        return file.endsWith('.js') && file !== 'index.js';
      })
      .forEach((file) => {
        const model = require(path.join(rootpath, basePath, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
      });

    Object.keys(db).forEach((modelName) => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
    return db;
  }

  // eslint-disable-next-line no-unused-vars
  async _createDatabase(config) {
    throw new Error(`Must be implemented in the subclass!!!`);
  }

  // eslint-disable-next-line no-unused-vars
  async _dropDatabase(config) {
    throw new Error(`Must be implemented in the subclass!!!`);
  }

  async _executeSeedsUp(db, basepath) {
    const files = fs.readdirSync(basepath);
    for (const file of files) {
      await require(path.join(basepath, file)).up(db.sequelize.getQueryInterface(), db.sequelize);
    }
  }

  async _executeSeedsDown(db, basepath) {
    const files = fs.readdirSync(basepath);
    const filesReversed = files.reverse();
    for (const file of filesReversed) {
      await require(path.join(basepath, file)).down(db.sequelize.getQueryInterface(), db.sequelize);
    }
  }

  async closeConnectionDatabase() {
    const db = this.getDatabase();
    await db.sequelize.close();
  }
}

module.exports = DefaultDatabaseImplementation;