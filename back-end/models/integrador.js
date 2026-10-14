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
                    nome:{
                        type: DataTypes.STRING,
                        allowNull: false,
                    },
                },
                {
                    sequelize,
                    modelName: 'Integrador',
                    tableName: 'integradors',
                    freezeTableName: true,
                    timestamps: true,
                    // scopes:{
                    //     excludeToken:{
                    //         attributes:{
                    //             exclude: ['token'],
                    //         },
                    //     },
                    // },
                }
            );
        }


        static associate(models){
            this.hasMany(models.Equipamento, {
                foreignKey: {name: 'integradorId', allowNull: false},
            });
            super.associate(models);
        }
    }

    Integrador.init(sequelize);
    return Integrador;
};