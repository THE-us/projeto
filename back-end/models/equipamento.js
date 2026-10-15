'use strict';
const BaseModel = require('../bases/base-model');

module.exports = (sequelize, DataTypes) => {
  class Equipamento extends BaseModel{
    static init(sequelize){
      return super.init(
        {
          id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          codigo:{
            type: DataTypes.STRING(11),
            allowNull: false,
          },
          faixa:{
            type: DataTypes.TINYINT,
            allowNull: false,
          },
          tipo:{
            type: DataTypes.ENUM('CEV', 'REV', 'CEM'),
            allowNull: false,
          },
          ativo:{
            type: DataTypes.TINYINT,
            allowNull: false,
          },
          local:{
            type: DataTypes.STRING(80),
            allowNull: false,
          },
          marca:{
            type: DataTypes.STRING(40),
            allowNull: false,
          },
          modelo:{
            type: DataTypes.STRING(40),
            allowNull: false,
          },
          velocidadeLimite:{
            type: DataTypes.SMALLINT,
            allowNull: false,
          },
          dataAfericao:{
            type: DataTypes.DATE,
            allowNull: true,
          },
          lacre:{
            type: DataTypes.STRING(20),
            allowNull: false,
          },
          dataRegistroInmetro:{
            type: DataTypes.DATE,
            allowNull: true,
          },
          numeroInmetro:{
            type: DataTypes.STRING(30),
            allowNull: true,
          },
          integradorId:{
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          municipioId:{
            type: DataTypes.INTEGER,
            allowNull: false,
          },
        },
        {
          sequelize,
          modelName: 'Equipamento',
          tableName: 'equipamentos',
          freezeTableName: true,
          timestamps: true,
        }
      );
    }

    static associate(models){
      this.belongsTo(models.Integrador, {
        foreignKey: {name: 'integradorId', allowNull: false},
      });
      this.belongsTo(models.Municipio, {
        foreignKey: {name:'municipioId', allowNull: false},
      });
      this.hasMany(models.Fluxo, {
        foreignKey: {name:'equipamentoId', allowNull: false},
      });
      super.associate(models);
    }
  }

  Equipamento.init(sequelize);
  return Equipamento;
}