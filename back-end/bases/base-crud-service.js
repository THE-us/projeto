'use strict';

class BaseCrudService{
    constructor(model){
        this.model = model;
    }

    async findAll(filter){
        return this.model.findAll(filter);
    }

    findAndCountAll(filter){
        return this.model.findAndCountAll(filter);
    }

    async count(filter){
        return this.model.count(filter);
    }

    async findById(id, filter){
        return this.model.findById(id, filter);
    }

    async findByIdOrThrowError(id, filter){
        return this.model.findByIdOrThrowError(id, filter);
    }

    async findOne(filter){
        return this.model.findOne(filter);
    }

    async findOneOrThrowError(filter){
        return this.model.findOneOrThrowError(filter);
    }

    async create(values, filter){
        await this.validateCreate(values);
        return this.model.create(values, filter);
    }

    async bulkCreate(values, filter){
        await this.validateCreate(values);
        return this.model.bulkCreate(values, filter);
    }

    async update(values, filter){
        return this.model.update(values, filter);
    }

    async updateById(id, values){
        await this.validateUpdateById(id, values);
        return this.model.updateById(id, values);
    }

    async updateByIdOrThrowError(id, values){
        await this.validateUpdateById(id, values);
        return this.model.updateByIdOrThrowError(id, values);
    }

    async deleteById(id){
        await this.validateDeleteById(id);
        return this.model.deteleById(id);
    }

    async deleteByIdOrThrowError(id){
        await this.validateDeleteById(id);
        return this.model.deleteByIdOrThrowError(id);
    }

    async min(field, options){
        return this.model.min(field, options);
    }
}

module.exports = BaseCrudService;