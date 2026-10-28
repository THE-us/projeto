'use strict';
const BaseModel = require('../bases/base-model');
let x = true;

module.exports = (sequelize, DataTypes) => {
  class Fluxo extends BaseModel{
    static init(sequelize){
      return super.init(
        {
          id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          seq:{
            type: DataTypes.INTEGER,
            allowNull: x,
          },
          data:{
            type: DataTypes.DATE,
            allowNull: x,
          },
          hora:{
            type: DataTypes.TIME,
            allowNull: x,
          },
          placa:{
            type: DataTypes.STRING(7),
            allowNull: x,
          },
          velMed:{
            type: DataTypes.SMALLINT,
            allowNull: x,
          },
          tamVeic:{
            type: DataTypes.SMALLINT,
            allowNull: x,
          },
          classVeic:{
            type: DataTypes.STRING(3),
            allowNull: x,
          },
          pesoBt:{
            type: DataTypes.INTEGER,
            allowNull: x,
          },
          dataRecebimento:{
            type: DataTypes.DATE,
            allowNull: x,
          },
          equipamentoId:{
            type: DataTypes.INTEGER,
            allowNull: false,
          },
        },
        {
          sequelize,
          modelName: 'Fluxo',
          tableName: 'fluxo',
          freezeTableName: true,
          timestamps: true,
          indexes: [
            {
              name: 'idx_fluxo_data_hora',
              fields: ['data', 'hora']
            },
            {
              name: 'idx_fluxo_placa',
              fields: ['placa']
            },
            {
              name: 'idx_fluxo_equipamento_data',
              fields: ['equipamentoId', 'data']
            }
          ]
        }
      );
    }

    static associate(models){
      this.belongsTo(models.Equipamento, {
        foreignKey: {name: 'equipamentoId', allowNull: false},
      });
      super.associate(models);
    }
  }

  Fluxo.init(sequelize);
  return Fluxo;
}