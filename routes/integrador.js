const express = require('express');
const checkAuth = require('../middleware/check-auth');
const integradorController = require('../controllers/integrador.controller');

const router = express.Router();

router.get("/", checkAuth.checkAuth, integradorController.index);

module.exports = router;