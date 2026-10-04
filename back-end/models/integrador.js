'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Integrador extends Model {
    static associate(models) {
      Integrador.hasMany(models.Equipamento, {foreignKey: 'integradorId'});
    }
  }
  Integrador.init({
    nome: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Integrador',
  });
  return Integrador;
};