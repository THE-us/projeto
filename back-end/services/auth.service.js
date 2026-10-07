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
        const integrador = await Integrador.findById(id);
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
    const usuario = await Usuario.findByLogin(credentials.login);
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
      const usuario = await Usuario.findById(payloadRefreshToken.id);
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
    const usuario = await Usuario.findById(user.id);
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
    const usuario = await Usuario.findById(userId);
    const userDetails = {
      nome: usuario.nome,
      perfil: usuario.perfil,
    };
    return userDetails;
  }

  jwtAuthorize() {
    return [
      // authenticate JWT token and attach user to request object (req.user)
      jwt({
        secret: config.security.jwtSignKey,
        algorithms: ['HS256'],
      }),

      // autoriza para o órgao do token
      async (req, res, next) => {
        if (!req.auth) {
          next(new UnauthorizedError());
        }
        const { Usuario } = db.getDatabase();
        const usuario = await Usuario.scope('excludeSenha').findById(req.auth.id);
        if (!usuario || !usuario.ativo) {
          next(new UnauthorizedError());
        }
        req.auth.perfil = usuario.perfil;
        req.auth.login = usuario.login;
        req.auth.name = usuario.nome;
        // For backward compatibility, also set req.user
        req.user = req.auth;
        next();
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
