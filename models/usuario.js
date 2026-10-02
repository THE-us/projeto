'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      // define association here
    }
  }
  Usuario.init({
    login: DataTypes.STRING(30),
    senha: DataTypes.STRING(100),
    nome: DataTypes.STRING(100),
    ativo: DataTypes.TINYINT(1)
  }, {
    sequelize,
    modelName: 'Usuario',
  });
  return Usuario;
};