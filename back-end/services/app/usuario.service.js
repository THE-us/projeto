'use strict';
const BaseCrudService = require('../../bases/base-crud-service');
const db = require('../../db/database');
const ValidationError = require('../../errors/validation-error');

class UsuarioService extends BaseCrudService{
    constructor(perfil){
        super(UsuarioService.getModel(perfil));
        this.perfil = perfil;
    }

    static getModel(perfil){
        const UsuarioModel = db.getDatabase().Usuario;
        
        const hasExcludeSenha = UsuarioModel && UsuarioModel.options && UsuarioModel.options.scopes && UsuarioModel.options.scopes.excludeSenha;

        if(!perfil){
            return hasExcludeSenha ? UsuarioModel.scope('excludeSenha') : UsuarioModel;
        }else{
            const hasFromPerfil = UsuarioModel && UsuarioModel.options && UsuarioModel.options.scopes && UsuarioModel.options.scopes.fromPerfil;
            
            if (hasExcludeSenha && hasFromPerfil) {
                return UsuarioModel.scope('excludeSenha', {method: ['fromPerfil', perfil]});
            } else if (hasExcludeSenha) {
                return UsuarioModel.scope('excludeSenha');
            } else {
                return UsuarioModel;
            }
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
    
    async validateCreate(login, nome, senha) {
        return true;
    }

    async validateUpdateById(id, values) {
        return true;
    }

    async validateDeleteById(id) {
        return true;
    }
}

module.exports = UsuarioService;