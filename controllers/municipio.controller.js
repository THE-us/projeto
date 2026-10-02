const models = require('../models');

function index(req, res){
    models.Municipio.findAll().then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(500).json({
            message: "ERROR EM PEGAR TODOS OS MUNICIPIOS"
        });
    })
}

module.exports = {
    index: index
}