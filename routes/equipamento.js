const express               =                               require('express');
const checkAuth             =              require('../middleware/check-auth');
const equipamentoController = require('../controllers/equipamento.controller');

const router = express.Router();

router.post("/", checkAuth.checkAuth, equipamentoController.cadastrar);
router.patch("/:id", checkAuth.checkAuth, equipamentoController.atualizar);
router.delete("/:id", checkAuth.checkAuth, equipamentoController.deletar);
router.get("/", equipamentoController.index);

module.exports = router;