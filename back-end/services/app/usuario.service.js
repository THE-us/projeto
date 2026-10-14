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

    async authenticate(login, nome, senha) {
        const usuario = await this.model.unscoped().findOne({ where: { login, nome } });

        //console.log('DEBUGGANDO');
        //console.log('1. Usuario encontrado: ', usuario ? usuario.toJSON() : null);
        
        if (!usuario) {
            //console.log('Usuario não existe');
            return null;
        }

        //console.log('2. Senha recebida na requisição: ', senha);
        //console.log('3. SenhaHash armazenada no objeto usuario: ', usuario.senha);
        
        const senhaValida = await usuario.checkSenha(senha);
        
        //console.log('4. Resultado de usuario.checkSenha(senha): ', senhaValida);

        if (!senhaValida) {
            //console.log('Senha inválida');
            return null;
        }
    
        //console.log('Retorno: ', usuario);
        return usuario;
    }
    
    async validateCreate(login, nome, senha) {
        // const existe = await this.model.findOne({where:{login: login, nome: nome}});

        // if(existe){
        //     return res.status(401).json({error: 'Já existe um usuario com login e nome.'});
        // }

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