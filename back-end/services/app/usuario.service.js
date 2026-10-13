'use strict';
const BaseCrudService = require('../../bases/base-crud-service');
const db = require('../../db/database');

class UsuarioService extends BaseCrudService{
    constructor(perfil){
        super(UsuarioService.getModel(perfil));
        this.perfil = perfil;
    }

    static getModel(perfil){
        const UsuarioModel = db.getDatabase().Usuario;
        
        // Verifica se o modelo existe e se o escopo excludeSenha foi registrado
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

    // --- Métodos de validação exigidos pelo BaseCrudService ---
    
    async validateCreate(values) {
        // Adicione regras de validação para criação aqui se precisar
        return true;
    }

    async validateUpdateById(id, values) {
        // Adicione regras de validação para atualização aqui se precisar
        return true;
    }

    async validateDeleteById(id) {
        // Adicione regras de validação para deleção aqui se precisar
        return true;
    }
}

module.exports = UsuarioService;