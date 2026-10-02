const express           =                            require('express');
const usuarioController = require ('../controllers/usuario.controller');

const router = express.Router();

router.post('/signUp', usuarioController.signUp);
router.post('/logIn', usuarioController.logIn);

module.exports = router;