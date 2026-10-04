'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Municipio extends Model {
    static associate(models) {
      Municipio.hasMany(models.Equipamento, {foreignKey: 'municipioId'});
    }
  }
  Municipio.init({
    codigo: DataTypes.INTEGER,
    descricao: DataTypes.STRING(100),
    uf: {
      type:
      DataTypes.ENUM('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO')
    }
  }, {
    sequelize,
    modelName: 'Municipio',
  });
  return Municipio;
};