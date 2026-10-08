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
                        primaryKey: true,
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
                    modelName: 'Usuario',
                    freezeTableName: true,
                    timestamp: true,
                    name:{
                        singular: 'Usuario',
                        plural: 'Usuarios',
                    },
                    scopes:{
                        excludeSenha:{
                            attributes:{
                                exclude: ['senha'],
                            },
                        },
                    },
                    hooks:{
                        beforeSave: async(usuario) => {
                            if(usuario.senha){
                                const senhaHash = await bcrypt.hash(usuario.senha, config.security.bcryptSaltRound);
                                usuario.senha = senhaHash;
                            }
                        },
                    },
                }
            );
        }

        static associate(models){
            this.belongsTo(models.Usuario.scope('excludeSenha'), {
                foreignKey: {name:'createdBy'},
                as: 'CreatedBy',
            });
            this.belognsTo(models.Usuario.scope('excludeSenha'), {
                foreignKey: {name: 'updatedBy'},
                as: 'UpdatedBy',
            });
            super.associate(models);
        }

        async checkSenha(senha){
            const match = await bcrypt.compare(senha, this.senha);
            return match;
        }

        async changeSenha(novaSenha){
            const novaSenhaHash = await bcrypt.hash(novaSenha, config.security.bcryptSaltRound);
            return this.update({senha: novaSenhaHash});
        }

        static async findByLogin(login){
            return this.findOne({where: { login }});
        }
    }

    Usuario.init(sequelize);
    return Usuario;
}