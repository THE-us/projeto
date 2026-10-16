//Conecta, inicializa e coordena a primeira camada da requisição e do projeto
require('dotenv').config();
const cors = require('cors');
const express      =                    require('express');
const errorHandler = require('./errors/app-error-handler');
const database     =   require('./db/init-mysql-database');

database.initDatabase();

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:4200'
}));

app.use(require('./controllers'));

module.exports = app;