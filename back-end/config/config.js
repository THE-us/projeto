module.exports = {
    database:{
        host: process.env.DB_HOSTNAME,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: `${process.env.DB_NAME}`
    },
    security:{
        bcryptSaltRound: +process.env.SECURITY_BCRYPT_SALT_ROUND,
        jwtSignKey: process.env.SECURITY_JWT_SIGN_KEY,
        jwtAccesseTokenExpiresIn: process.env.SECURITY_JWT_ACCESS_TOKEN_EXPIRES_IN,
        jwtRefreshTokenExpiresIn: process.env.SECURITY_JWT_REFRESH_TOKEN_EXPIRES_IN,
    },
};