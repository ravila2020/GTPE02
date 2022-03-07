const express = require('express');
const app = express();

const logger = require('../log/log');

const { verificaToken } = require('../middleware/autenticacion');

const { ParametrosModel } = require('../models/parametros.model');
const { PersonaModel } = require('../models/persona.model');
const { VehiculoModel } = require('../models/vehiculo.model');

const persona = require('../dao/persona.dao');
const contrato = require('../dao/contrato.dao');

const ruta = ' [registro.js] ';

/****************************************************************************
 * Consulta - Concesionarios Registro
 ****************************************************************************/
app.get('/concesionario-registro', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: concesionario-registro';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        const parametrosModel = new ParametrosModel({
            IdUsuario: pUsuarioOperacion || ''
        });

        persona.consultaConcesionarioReg(parametrosModel)
            .then(result => {
                let resultado = JSON.stringify(result);
                let datos = JSON.parse(resultado);

                ok = datos.estatus;
                mensaje = datos.mensaje;

                if (ok) {

                    res.json({
                        estatus: true,
                        mensaje,
                        concesionario: datos.concesionarios
                    });

                } else {

                    logger.info(ruta + 'Atención: ' + mensaje);
                    res.json({
                        estatus: false,
                        mensaje,
                        concesionario: []
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
            estatus: false,
            error: err.message
        });

    }
});

/****************************************************************************
 * Consulta - Datos de Contrato para su generación
 ****************************************************************************/
app.get('/contrato', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: contrato';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        const parametrosModel = new ParametrosModel({
            IdUsuario: pUsuarioOperacion || '',
            IdVehiculo: req.query.IdVehiculo || 0
        });

        if (parametrosModel.IdVehiculo == 0) {
            mensaje = 'Verifique la información requerida.';
            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });
        } else {
            contrato.consultaDatosContrato(parametrosModel)
                .then(result => {
                    let resultado = JSON.stringify(result);
                    let datos = JSON.parse(resultado);

                    ok = datos.estatus;
                    mensaje = datos.mensaje;

                    if (ok) {

                        res.json({
                            estatus: true,
                            mensaje,
                            contrato: datos.contrato
                        });

                    } else {

                        logger.info(ruta + 'Atención: ' + mensaje);
                        res.json({
                            estatus: false,
                            mensaje,
                            concesionario: []
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
            estatus: false,
            error: err.message
        });

    }
});

/****************************************************************************
 * Consulta - Concesionarios para verificar documentación
 ****************************************************************************/
app.get('/concesionario-verificacion', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: concesionario-verificacion';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        const parametrosModel = new ParametrosModel({
            IdUsuario: pUsuarioOperacion || ''
        });

        persona.consultaConcesionarioVerifica(parametrosModel)
            .then(result => {
                let resultado = JSON.stringify(result);
                let datos = JSON.parse(resultado);

                ok = datos.estatus;
                mensaje = datos.mensaje;

                if (ok) {

                    res.json({
                        estatus: true,
                        mensaje,
                        concesionario: datos.concesionarios
                    });

                } else {

                    logger.info(ruta + 'Atención: ' + mensaje);
                    res.json({
                        estatus: false,
                        mensaje,
                        concesionario: []
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
            estatus: false,
            error: err.message
        });

    }
});

module.exports = app;