'use strict';
const BaseModel = require('../bases/base-model');

module.exports = (sequelize, DataTypes) => {
  class Municipio extends BaseModel{
    static init(sequelize){
      return super.init(
        {
          id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          codigo:{
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          descricao:{
            type: DataTypes.STRING(100),
            allowNull: false,
          },
          uf:{
            type: DataTypes.ENUM('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'),
            allowNull: false,
          },
        },
        {
          sequelize,
          modelName: 'Municipio',
          tableName: 'municipios',
          freezeTableName: true,
          timestamps: true,
        }
      );
    }

    static associate(models){
      this.hasMany(models.Equipamento, {
        foreignKey: {name: 'municipioId', allowNull: false},
      });
      super.associate(models);
    }
  }

  Municipio.init(sequelize);
  return Municipio;
}