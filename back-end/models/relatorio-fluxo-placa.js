'use strict';
const BaseModel = require('../bases/base-model');

module.exports = (sequelize, DataTypes) => {
  class RelatorioFluxoPlaca extends BaseModel{
    static init(sequelize){
      return super.init(
        {
          placa:{
            type: DataTypes.STRING(7),
            primaryKey: true,
            allowNull: false,
          },
          equipamentoId:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
          },
          total:{
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          primeiraPassagem:{
            type: DataTypes.DATE,
            allowNull: true,
          },
          ultimaPassagem:{
            type: DataTypes.DATE,
            allowNull: true,
          },
        },
        {
          sequelize,
          modelName: 'RelatorioFluxoPlaca',
          tableName: 'RelatorioFluxoPlaca',
          freezeTableName: true,
          timestamps: false,
        }
      );
    }

    static associate(models){
      this.belongsTo(models.Equipamento, {
        foreignKey: {name: 'equipamentoId', allowNull: false},
        constraints: false,
      });
      super.associate(models);
    }
  }

  RelatorioFluxoPlaca.init(sequelize);
  return RelatorioFluxoPlaca;
}
