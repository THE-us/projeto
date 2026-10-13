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

    async authenticate(login, senha) {
        // Usamos unscope() ou findOne buscando o model sem o escopo de exclusão de senha
        const UsuarioModel = UsuarioService.getModel(null); // ou buscar direto da base sem escopo
        const usuario = await this.model.unscoped().findOne({ where: { login } });
        
        if (!usuario) {
            return null;
        }
        
        const senhaValida = await usuario.checkSenha(senha);
            if (!senhaValida) {
                return null;
        }
        
        // Retorna o usuário autenticado
        return usuario;
    }
    
    async validateCreate(values) {
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