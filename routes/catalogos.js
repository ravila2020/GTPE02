const express = require('express');
const app = express();

const logger = require('../log/log');
const { DictamenesModel } = require('../models/catalogos.model');
const { verificaToken } = require('../middleware/autenticacion');
const catalogos = require('../dao/catalogos.dao');

const ruta = ' [catalogos.js] ';

/* ********** Catalogos : Dictamenes********** */


app.get('/cat-dictamenes', verificaToken, (req, res) => {

    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: Cat Dictamenes';
        logger.info(etiquetaLOG);
        
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;
        let bodyEstado = 'A';

        const dictamenesModel = new DictamenesModel({
            IdDictamen: '',
            Nombre: '',
            Estatus: 'A'
        });     

        let etiquetaLOG2 = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: Cat Dictamenes 2';
        logger.info(etiquetaLOG2);
        

        catalogos.obtieneDictamenes(bodyEstado)
                .then(result => {
                let etiquetaLOGra = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: catalogos.obtieneUsuarios';
                logger.info(etiquetaLOGra);

                let resultado = JSON.stringify(result);
                let listaDat = JSON.parse(resultado);

                let etiquetaLOGra2 = ruta + '[resultado: ' + resultado;
                logger.info(etiquetaLOGra2);
                let etiquetaLOGra3 = ruta + '[listaDat: ' + listaDat;
                logger.info(etiquetaLOGra3);

                ok = listaDat.estatus;
                mensaje = listaDat.mensaje;
                contenido = listaDat.dictamenes;

                if (ok) {

                    res.json({
                        ok,
                        mensaje,
                        contenido
                    });

                } else {

                    logger.info(ruta + 'Atención: ' + mensaje);
                    res.json({
                        estatus: false,
                        mensaje,
                        dictamenes: resultado.usuarios
                    });
                }

            }, (err) => {

                logger.error(ruta + 'ERROR: ' + err);
                res.json({
                    estatus: false,
                    mensaje: err
                });

            })

    } catch (err) {
        logger.error(ruta + 'ERROR: ' + err);

        res.json({
            estatus: false
        });

    }
});

module.exports = app;
