const express             =                             require('express');
const checkAuth           =            require('../middleware/check-auth');
const municipioController = require('../controllers/municipio.controller');

const router = express.Router();

router.get("/", checkAuth.checkAuth, municipioController.index);

module.exports = router;