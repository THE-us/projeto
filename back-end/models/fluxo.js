'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fluxo extends Model {
    static associate(models) {
      Fluxo.belongsTo(models.Equipamento, {foreignKey: 'equipamentoId'});
    }
  }
  Fluxo.init({
    seq:           DataTypes.INTEGER,
    data:         DataTypes.DATEONLY,
    hora:             DataTypes.TIME,
    placa:       DataTypes.STRING(7),
    velMed:       DataTypes.SMALLINT,
    tamVeic:      DataTypes.SMALLINT,
    classVeic:   DataTypes.STRING(3),
    pesoBt:        DataTypes.INTEGER,
    dataRecebimento:  DataTypes.DATE,
    equipamentoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Fluxo',
    tableName: 'fluxo'
  });
  return Fluxo;
};