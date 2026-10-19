'use strict';
const express = require('express');
const router  = express.Router();
const auth    = require('../services/auth.service');

router.use('/auth', require('./auth.controller'));
router.use('/info', require('./info.controller'));

router.use('/usuario', auth.jwtAuthorize(), require('./usuario.controller'));
router.use('/integrador', auth.jwtAuthorize(), require('./integrador.controller'));
router.use('/municipio', auth.jwtAuthorize(), require('./municipio.controller'));
router.use('/equipamento', auth.jwtAuthorize(), require('./equipamento.controller'));
router.use('/fluxo', auth.jwtAuthorize(), require('./fluxo.controller'));

module.exports = router;