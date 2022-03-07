const express = require('express');
const app = express();

const logger = require('../log/log');

const { verificaToken } = require('../middleware/autenticacion');

const { ParametrosModel } = require('../models/parametros.model');
const listas = require('../dao/listas.dao');

const ruta = ' [listas.js] ';

/****************************************************************************
 * Sindicatos lista
 ****************************************************************************/
app.get('/sindicatos-lista', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: sindicatos-lista';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        const parametrosModel = new ParametrosModel({
            IdUsuario: pUsuarioOperacion || '',
            TipoConsulta: 'Lista',
            Estatus: 'A'
        });

        listas.obtieneSindicatos(parametrosModel)
            .then(result => {
                let resultado = JSON.stringify(result);
                let listaDat = JSON.parse(resultado);

                ok = listaDat.estatus;
                mensaje = listaDat.mensaje;

                if (ok) {

                    res.json({
                        estatus: true,
                        mensaje,
                        sindicatos: listaDat.sindicatos
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

/****************************************************************************
 * Tipos asignación
 ****************************************************************************/
app.get('/tipos-asignacion-lista', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: tipos-asignacion-lista';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        const parametrosModel = new ParametrosModel({
            IdUsuario: pUsuarioOperacion || '',
            IdSindicato: req.query.IdSindicato || 0
        });

        if (parametrosModel.IdSindicato == 0) {
            mensaje = 'El Sindicato es requerido.';
            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });
        } else {

            listas.obtieneAsignacionSindicato(parametrosModel)
                .then(result => {
                    let resultado = JSON.stringify(result);
                    let listaDat = JSON.parse(resultado);

                    ok = listaDat.estatus;
                    mensaje = listaDat.mensaje;

                    if (ok) {

                        res.json({
                            estatus: true,
                            mensaje,
                            asignaciones: listaDat.asignacion
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
            estatus: false
        });

    }
});

/****************************************************************************
 * Consulta por CP
 ****************************************************************************/
app.get('/cp-asentamientos', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: cp-asentamientos';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        const parametrosModel = new ParametrosModel({
            IdUsuario: pUsuarioOperacion || '',
            CP: req.query.CP || ''
        });

        if (parametrosModel.CP == '') {
            mensaje = 'El CP es requerido.';
            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });
        } else {
            listas.obtieneAsentamientos(parametrosModel)
                .then(result => {
                    let resultado = JSON.stringify(result);
                    let usuarioDat = JSON.parse(resultado);

                    ok = usuarioDat.estatus;
                    mensaje = usuarioDat.mensaje;

                    if (ok) {

                        res.json({
                            estatus: true,
                            mensaje,
                            cp: usuarioDat.asentamientos
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

/****************************************************************************
 * Identificaciones lista
 ****************************************************************************/
app.get('/identificaciones-lista', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: identificaciones-lista';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        listas.obtieneIdentificaciones(pUsuarioOperacion)
            .then(result => {
                let resultado = JSON.stringify(result);
                let listaDat = JSON.parse(resultado);

                ok = listaDat.estatus;
                mensaje = listaDat.mensaje;

                if (ok) {

                    res.json({
                        estatus: true,
                        mensaje,
                        identificaciones: listaDat.identificaciones
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

/****************************************************************************
 * Dictamen lista
 ****************************************************************************/
app.get('/dictamen-lista', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: dictamen-lista';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        listas.obtieneDictamen(pUsuarioOperacion)
            .then(result => {
                let resultado = JSON.stringify(result);
                let listaDat = JSON.parse(resultado);

                ok = listaDat.estatus;
                mensaje = listaDat.mensaje;

                if (ok) {

                    res.json({
                        estatus: true,
                        mensaje,
                        dictamenes: listaDat.dictamenes
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

/****************************************************************************
 * Marcas lista
 ****************************************************************************/
app.get('/marcas-lista', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: marcas-lista';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        listas.obtieneMarcas(pUsuarioOperacion)
            .then(result => {
                let resultado = JSON.stringify(result);
                let listaDat = JSON.parse(resultado);

                ok = listaDat.estatus;
                mensaje = listaDat.mensaje;

                if (ok) {

                    res.json({
                        estatus: true,
                        mensaje,
                        marcas: listaDat.marcas
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

/****************************************************************************
 * Submarcas lista
 ****************************************************************************/
app.get('/submarcas-lista', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: submarcas-lista';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        const parametrosModel = new ParametrosModel({
            IdUsuario: pUsuarioOperacion || '',
            IdMarca: req.query.IdMarca || 0
        });

        if (parametrosModel.IdMarca == 0) {
            mensaje = 'La Marca es requerida.';
            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });
        } else {

            listas.obtieneSubmarcas(parametrosModel)
                .then(result => {
                    let resultado = JSON.stringify(result);
                    let listaDat = JSON.parse(resultado);

                    ok = listaDat.estatus;
                    mensaje = listaDat.mensaje;

                    if (ok) {

                        res.json({
                            estatus: true,
                            mensaje,
                            submarcas: listaDat.submarcas
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
            estatus: false
        });

    }
});


module.exports = app;