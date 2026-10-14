'use strict';
const express =                  require('express');
const router  =                    express.Router();
const auth    = require('../services/auth.service');

router.use('auth', require('./auth.controller'));
router.use('/info', require('./info.controller'));

router.use('/usuario', require('./usuario.controller'));
router.use('/integrador', require('./integrador.controller'));

module.exports = router;