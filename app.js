require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const usuarioRoute = require('./routes/usuario');
const integradorRoute = require('./routes/integrador');
const municipioRoute = require('./routes/municipio');
const equipamentoRoute = require('./routes/equipamento');

const app = express();

app.use(bodyParser.json());

app.use('/usuario', usuarioRoute);
app.use('/integrador', integradorRoute);
app.use('/municipio', municipioRoute);
app.use('/equipamento', equipamentoRoute);

module.exports = app;