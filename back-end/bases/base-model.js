'use strict';
const { Model } = require('sequelize');
const ResourceNotFoundError = require('../errors/resource-not-found-error');

class BaseModel extends Model {
    static init(attributes, options){
        this.user = options.users;
        return super.init(attributes, options);
    }

    static associate(models){
        if(this.users){
            this.belongsTo(models.Usuario.scope('excludeSenha'), {
                foreignKey: {name: 'createdBy', allowNull: false},
                as: 'CreatedBy',
            });
            this.belongsTo(models.Usuario.scope('excludeSenha'), {
                foreignKey: {name: 'updatedBy', allowNull: false},
                as: 'UpdatedBy',
            });
        }
    }
    
    static async findById(id, options = {}){
        return this.findByPk(id, options);
    }

    static async findByIdOrThrowError(id, options = {}){
        const instance = await this.findById(id, options);
        if(instance){
            return instance;
        }else{
            this._throwResourceNotFoundError({ id });
        }
    }

    static async findOneOrThrowError(options){
        const instance = await this.findOne(options);
        if(instance){
            return instance;
        }else{
            this._throwResourceNotFoundError(options);
        }
    }

    static async delete(options){
        const deleted = await this.destroy(options);
        return deleted;
    }

    static async deleteById(id){
        const instance = await this.findById(id);
        let deleted = 0;
        if(instance){
            await instance.destroy();
            deleted = 1;
        }
        return deleted;
    }

    static async deleteByIdOrThrowError(id){
        const instance = await this.findByIdOrThrowError(id);
        await instance.destroy();
        const deleted = 1;
        return deleted;
    }

    static async updateById(id, values, options){
        const instance = await this.findById(id);
        if(instance){
            const updatedInstance = await instance.update(values, options);
            return updatedInstance;
        }
        return null;
    }

    static async updateByIdOrThrowError(id, values, options){
        const instance = await this.findByIdOrThrowError(id);
        const updatedInstance = await instance.update(values, options);
        return updatedInstance;
    }

    static _throwResourceNotFoundError(options){
        const messageOptions = options.where ? JSON.stringify(options.where) : JSON.stringify(options);
        throw new ResourceNotFoundError(`Resource Not Found: ${this.name} with ${messageOptions}`);
    }
}

module.exports = BaseModel;