'use strict';
const db = require('../db/database');
const UnauthorizedError = require('../errors/unauthorized-error');
const TokenService = require('./token.service');
const { expressjwt: jwt } = require('express-jwt');
const config = require('../config/config');
const ForbiddenError = require('../errors/forbidden-error');

class AuthService {
  constructor() {
    this.tokenService = new TokenService();
  }

  tokenAuthenticate() {
    return async (req, res, next) => {
      try {
        const id = req.get('x-auth-id');
        const token = req.get('x-auth-token');
        if (!id || !token) {
          throw new UnauthorizedError();
        }
        const { Integrador } = db.getDatabase();
        // CORREÇÃO: findById substituído por findByPk
        const integrador = await Integrador.findByPk(id);
        if (!integrador || !integrador.ativo) {
          throw new UnauthorizedError();
        }
        if (integrador.token != token) {
          throw new UnauthorizedError();
        }
        req.integrador = {
          id: integrador.id,
          name: integrador.nome,
        };
        next();
      } catch (error) {
        next(new UnauthorizedError());
      }
    };
  }

  async login(credentials) {
    const { Usuario } = db.getDatabase();
    
    // CORREÇÃO PRINCIPAL: Usar o findOne e unscoped() para garantir que traz a senha
    const usuario = await Usuario.unscoped().findOne({ where: { login: credentials.login } });
    
    if (!usuario || !usuario.ativo) {
      throw new UnauthorizedError();
    }
    const matched = await usuario.checkSenha(credentials.senha);
    if (!matched) {
      throw new UnauthorizedError();
    }
    const accessToken = this.tokenService.createAccessToken(usuario);
    const refreshToken = this.tokenService.createRefreshToken(usuario);
    return { accessToken, refreshToken };
  }

  async refresh(tokens) {
    try {
      const payloadAccessToken = this.tokenService.decodeToken(tokens.accessToken);
      const payloadRefreshToken = this.tokenService.verifyToken(tokens.refreshToken);
      if (payloadAccessToken.id != payloadRefreshToken.id) {
        throw new UnauthorizedError();
      }
      const { Usuario } = db.getDatabase();
      // CORREÇÃO: findById substituído por findByPk
      const usuario = await Usuario.findByPk(payloadRefreshToken.id);
      if (!usuario || !usuario.ativo) {
        throw new UnauthorizedError();
      }
      const accessToken = this.tokenService.createAccessToken(usuario);
      const refreshToken = tokens.refreshToken;
      return { accessToken, refreshToken };
    } catch (error) {
      throw new UnauthorizedError();
    }
  }

  async changePassword(passwords, user) {
    const { Usuario } = db.getDatabase();
    // CORREÇÃO: findById substituído por findByPk
    const usuario = await Usuario.findByPk(user.id);
    const matched = await usuario.checkSenha(passwords.senhaAntiga);
    if (!matched) {
      return { success: false, error: 'Senha antiga inválida.' };
    }
    usuario.senha = passwords.senhaNova;
    await usuario.save();
    return { success: true };
  }

  async getUserDetails(userId) {
    const { Usuario } = db.getDatabase();
    // CORREÇÃO: findById substituído por findByPk
    const usuario = await Usuario.findByPk(userId);
    const userDetails = {
      nome: usuario.nome,
      perfil: usuario.perfil,
    };
    return userDetails;
  }

  jwtAuthorize() {
    return [
      jwt({
        secret: config.security.jwtSignKey,
        algorithms: ['HS256'],
      }),

      async (req, res, next) => {
        try {
          if (!req.auth || !req.auth.id) {
            return next(new UnauthorizedError());
          }
          const { Usuario } = db.getDatabase();
          
          // CORREÇÃO: findById substituído por findByPk com unscoped()
          const usuario = await Usuario.unscoped().findByPk(req.auth.id);
          
          if (!usuario || (usuario.ativo !== undefined && !usuario.ativo)) {
            return next(new UnauthorizedError());
          }
          
          req.auth.perfil = usuario.perfil || null; 
          req.auth.login = usuario.login;
          req.auth.name = usuario.nome;
          
          req.user = req.auth;
          next();
        } catch (error) {
          next(new UnauthorizedError());
        }
      },
    ];
  }

  perfilAuthorize(perfil) {
    return [
      async (req, res, next) => {
        const user = req.auth || req.user;
        if (!user) {
          next(new ForbiddenError());
        }

        if (!Array.isArray(perfil)) {
          perfil = [perfil];
        }

        const authorized = perfil.includes(user.perfil);
        if (!authorized) {
          next(new ForbiddenError());
        } else {
          next();
        }
      },
    ];
  }
}

module.exports = new AuthService();