const express = require('express');
const checkAuth = require('../middleware/check-auth');
const fluxoController = require('../controllers/fluxo.controller');

const router = express.Router();

router.get("/pesquisar", checkAuth.checkAuth, fluxoController.pesquisar);
router.get("/analisar", checkAuth.checkAuth, fluxoController.analisar);

module.exports = router;