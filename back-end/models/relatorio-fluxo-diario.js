'use strict';
const BaseModel = require('../bases/base-model');

module.exports = (sequelize, DataTypes) => {
  class RelatorioFluxoDiario extends BaseModel{
    static init(sequelize){
      return super.init(
        {
          equipamentoId:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
          },
          data:{
            type: DataTypes.DATEONLY,
            primaryKey: true,
            allowNull: false,
          },
          total:{
            type: DataTypes.INTEGER,
            allowNull: false,
          },
        },
        {
          sequelize,
          modelName: 'RelatorioFluxoDiario',
          tableName: 'RelatorioFluxoDiario',
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

  RelatorioFluxoDiario.init(sequelize);
  return RelatorioFluxoDiario;
}
