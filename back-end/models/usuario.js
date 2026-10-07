'use strict';
const BaseModel = require('../bases/base-model');
const bcrypt = require('bcryptjs');
const config = require('../config/config.json');

module.exports = (sequelize, DataTypes) => {
    class Usuario extends BaseModel{
        static init(sequelize){
            return super.init(
                {
                    id:{
                        type: DataTypes.INTEGER,
                        primarayKey: true,
                        autoIncrement: true,
                    },
                    login:{
                        type: DataTypes.STRING,
                        unique: true,
                        allowNull: false,
                    },
                    senha:{
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
                    
                }
            )
        }
    }
}