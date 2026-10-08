// const environment = require('./util/environment');
// environment.init();

require('dotenv').config();
// const cors             =                 require('cors');
const express          =              require('express');
const errorHandler = require('./errors/app-error-handler');
// const database = require('./db/database');
// const bodyParser       =          require('body-parser');

// const usuarioRoute     =     require('./routes/usuario');
// const integradorRoute  =  require('./routes/integrador');
// const municipioRoute   =   require('./routes/municipio');
// const equipamentoRoute = require('./routes/equipamento');
// const fluxoRoute = require('./routes/fluxo');

const app = express();

// app.use(cors({
//     origin: 'http://localhost:4200'
// }));

// app.use(bodyParser.json());

app.use(require('./controllers'));
// app.use('/integrador', integradorRoute);
// app.use('/municipio', municipioRoute);
// app.use('/equipamento', equipamentoRoute);
// app.use('/fluxo', fluxoRoute);


module.exports = app;