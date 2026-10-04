const express               =                               require('express');
const checkAuth             =              require('../middleware/check-auth');
const equipamentoController = require('../controllers/equipamento.controller');

const router = express.Router();

router.post("/", checkAuth.checkAuth, equipamentoController.cadastrar);
router.patch("/:id", checkAuth.checkAuth, equipamentoController.atualizar);
router.delete("/:id", checkAuth.checkAuth, equipamentoController.deletar);
router.get("/", checkAuth.checkAuth, equipamentoController.index);
router.get("/:id", checkAuth.checkAuth, equipamentoController.buscarPorId);

module.exports = router;