'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Equipamento extends Model {
    static associate(models) {
      Equipamento.belongsTo(models.Integrador, {foreignKey: 'integradorId'});
      Equipamento.belongsTo(models.Municipio, {foreignKey: 'municipioId'});
      Equipamento.hasMany(models.Fluxo, {foreignKey: 'equipamentoId'});
    }
  }
  Equipamento.init({
    codigo: DataTypes.STRING(11),
    faixa: DataTypes.TINYINT,
    tipo: {
      type:
      DataTypes.ENUM('CEV', 'REV', 'CEM')
    },
    ativo: DataTypes.TINYINT,
    local: DataTypes.STRING(80),
    marca: DataTypes.STRING(40),
    modelo: DataTypes.STRING(40),
    velocidadeLimite: DataTypes.SMALLINT,
    dataAfericao: DataTypes.DATEONLY,
    lacre: DataTypes.STRING(20),
    dataRegistroInmetro: DataTypes.DATEONLY,
    numeroInmetro: DataTypes.STRING(30),
    integradorId: DataTypes.INTEGER,
    municipioId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Equipamento',
  });
  return Equipamento;
};