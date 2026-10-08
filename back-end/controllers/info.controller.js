'use strict';
const{router, Response, wrapAsync} = require('../bases/base-controller')();
const authService = require('../services/auth.service');

router.get('/ping', (req, res) => {
    Response.ok(res, {ping:1});
});

router.get(
    '/me',
    authService.jwtAuthorize(),
    wrapAsync(async (req, res) => {
        const userId = req.user.id;
        const userDetails = await authService.getUserDetails(userId);
        Response.ok(res, userDetails);
    })
);

router.get(
    '/refatorar',
    wrapAsync(async (req, res) => {
        const imageProcessorService = new ImageProcessorService();
        const userDetails = await imageProcessorService.refatorarImagem();
        Response.ok(res, userDetails);
    })
);

module.exports = router;