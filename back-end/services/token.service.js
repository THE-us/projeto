'use strict';
const config = require('../config/config');
const jwt = require('jsonwebtoken');

class TokenService{
    createAccessToken(usuario){
        const payload = {
            id: usuario.id,
        };
        const token = jwt.sign(payload, config.security.jwtSignKey, {
            expiresIn: config.security.jwtAccessTokenExpiresIn || '1d',
        });
        return token;
    }

    createRefreshToken(usuario){
        const payload = {
            id: usuario.id,
        };
        const token = jwt.sign(payload, config.security.jwtSignKey, {
            expiresIn: config.security.jwtRefreshTokenExpiresIn || '7d',
        });
        return token;
    }

    verifyToken(token){
        const payload = jwt.verify(token, config.security.jwtSignKey);
        return payload;
    }

    decodeToken(token){
        const payload = jwt.decode(token);
        return payload;
    }
}

module.exports = TokenService;