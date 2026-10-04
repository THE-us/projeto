const models = require('../models');

function index(req, res){
    models.Integrador.findAll().then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(500).json({
            message: "ERROR EM BUSCAR OS INTEGRADORES"
        });
    })
}

module.exports = {
    index: index
}