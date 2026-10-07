const Response = {
    ok: (res, body) => {
        const statusCode = 200;
        res.status(statusCode).send(body);
    },

    created: (res, body) => {
        const statusCode = 201;
        res.status(statusCode).send(body);
    },

    updated: (res, body = {}) => {
        const statusCode = 200;
        res.status(statusCode).send(body);
    },

    deleted: (res, body) => {
        const statusCode = 200;
        res.status(statusCode).send(body);
    },

    end: (res, statusCode = 200) => {
        res.status(statusCode).end();
    },
};

module.exports = Response;