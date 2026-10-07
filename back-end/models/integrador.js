'use strict';

const BaseModel = require('../bases/base-model');

module.exports = (sequelize, DataTypes) => {
  class Integrador extends BaseModel{
    static init(sequelize){
      return super.init(
        {
          id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          token:{
            type: DataTypes.STRING,
            allowNull: false,
          },
          nome:{
            type: DataTypes.STRING,
            allowNull: false,
          },
          ativo:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
          },
        },
        {
          sequelize,
          modelName: 'Integrador',
          freezeTableName: true,
          timestamps: true,
          users: true,
          name:{
            singular: 'Integrador',
            plural: 'Integradores',
          },
          scopes:{
            excludeToken:{
              attributes:{
                exclude:['token'],
              },
            },
          },
        }
      );
    }

    static associate(models){
      this.hasMany(models.Faixa, {
        foreignKey: {name: 'integradorId', allowNull: false},
      });
      super.associate(models);
    }
  }

  Integrador.init(sequelize);
  return Integrador;
}