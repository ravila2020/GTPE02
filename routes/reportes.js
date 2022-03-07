const express = require('express');
const app = express();

const logger = require('../log/log');

const { verificaToken } = require('../middleware/autenticacion');

const { ParametrosModel } = require('../models/parametros.model');
const reportes = require('../dao/reportes.dao');

const ruta = ' [reportes.js] ';

/****************************************************************************
 * Reporte 1 --Situación Actual Concesionarios
 ****************************************************************************/
app.get('/reporte-situacion-vehiculo', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: reporte-situacion-vehiculo';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        const parametrosModel = new ParametrosModel({
            IdUsuario: pUsuarioOperacion || '',
            IdSindicato: req.query.IdSindicato || 0
        });

        reportes.obtieneReporte1(parametrosModel)
            .then(result => {
                let resultado = JSON.stringify(result);
                let usuarioDat = JSON.parse(resultado);

                ok = usuarioDat.estatus;
                mensaje = usuarioDat.mensaje;

                if (ok) {

                    res.json({
                        estatus: true,
                        mensaje,
                        reporte: usuarioDat.reporte
                    });

                } else {

                    logger.info(ruta + 'Atención: ' + mensaje);
                    res.json({
                        estatus: false,
                        mensaje
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