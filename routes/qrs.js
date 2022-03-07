const express = require('express');
const app = express();

const logger = require('../log/log');

const { verificaToken } = require('../middleware/autenticacion');

const { ConsultaModel } = require('../models/qr.model');
const qr = require('../dao/qr.dao');

const ruta = ' [qrs.js] ';

/****************************************************************************
 * qrs
 ****************************************************************************/
app.get('/impresion-qr', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: qrs';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        const consultaModel = new ConsultaModel({
            IdUsuario: pUsuarioOperacion || '',
            Placa: req.query.Placa || ''
        });

        if (consultaModel.Placa == 0) {
            mensaje = 'Se debe indicar la placa.';
            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });
        } else {
            qr.consultaOperadoresQR(consultaModel)
                .then(result => {
                    let resultado = JSON.stringify(result);
                    let usuarioDat = JSON.parse(resultado);

                    ok = usuarioDat.estatus;
                    mensaje = usuarioDat.mensaje;

                    if (ok) {

                        res.json({
                            estatus: true,
                            mensaje,
                            vehiculo: usuarioDat.vehiculo,
                            operadores: usuarioDat.operadores
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

        }


    } catch (err) {
        logger.error(ruta + 'ERROR: ' + err);

        res.json({
            estatus: false //,
                // mensaje: detErr + err.message + detErrC
        });

    }
});



module.exports = app;