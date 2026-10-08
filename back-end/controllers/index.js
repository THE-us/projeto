'use strict';
const express = require('express');
const router = express.Router();
const auth = require('../services/auth.service');

router.use('auth', require('./auth.controller'));
router.use('/info', require('./info.controller'));

router.use('/usuarios', auth.jwtAuthorize(), require('./usuario.controller'));

module.exports = router;