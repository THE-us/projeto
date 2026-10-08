'use strict';
const BaseCrudService = require('../../bases/base-crud-service');
const db = require('../../db/database');

class UsuarioService extends BaseCrudService{
    constructor(perfil){
        super(UsuarioService.getModel(perfil));
        this.perfil = perfil;
    }

    static getModel(perfil){
        if(!perfil){
            return db.getDatabase().usuario.scope('excludeSenha');
        }else{
            return db.getDatabase().usuario.scope('excludeSenha', {method: ['fromPerfil', perfil]});
        }
    }

    async alterarSenha(id, values){
        const usuario = await this.findByIdOrThrowError(id);
        usuario.senha = values.senha;
        await usuario.save();
    }

    async deleteByIdOrThrowError(id){
        try{
            const result = await super.deleteByIdOrThrowError(id);
            return result;
        }catch(error){
            if(error.name == 'SequelizeForeignKeyConstraintError'){
                return { error: true };
            }else{
                throw error;
            }
        }
    }
}

module.exports = UsuarioService