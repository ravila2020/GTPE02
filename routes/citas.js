const express = require('express');
const app = express();

const logger = require('../log/log');

const { verificaToken } = require('../middleware/autenticacion');

const { CitaModel } = require('../models/cita.model');

const cita = require('../dao/cita.dao');
const taller = require('../dao/taller.dao');

const ruta = ' [citas.js] ';

/****************************************************************************
 * Consulta - Talleres disponibles para cita
 ****************************************************************************/
app.get('/taller-cita', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: taller-cita';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        taller.consultaTalleresActivos('A', pUsuarioOperacion)
            .then(result => {
                let resultado = JSON.stringify(result);
                let datos = JSON.parse(resultado);

                ok = datos.estatus;
                mensaje = datos.mensaje;

                if (ok) {

                    res.json({
                        estatus: true,
                        mensaje,
                        Talleres: datos.talleres
                    });

                } else {

                    logger.info(ruta + 'Atención: ' + mensaje);
                    res.json({
                        estatus: false,
                        mensaje,
                        Talleres: []
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
 * Consulta - Disponibilidad por Taller por mes
 ****************************************************************************/
app.get('/taller-disponibilidad', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: taller-disponibilidad';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        let citaModel = new CitaModel({
            IdUsuario: pUsuarioOperacion || '',
            IdTaller: req.query.IdTaller || 0,
            Fecha: req.query.Fecha || '',
        });

        if (citaModel.IdTaller == 0 || citaModel.Fecha == '') {
            mensaje = 'Verifique la información requerida.';
            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });
        } else {

            cita.consultaTallerDisponibilidad(citaModel)
                .then(result => {
                    let resultado = JSON.stringify(result);
                    let datos = JSON.parse(resultado);

                    ok = datos.estatus;
                    mensaje = datos.mensaje;

                    if (ok) {

                        res.json({
                            estatus: true,
                            mensaje,
                            FechasDisponibles: datos.fechasDisp
                        });

                    } else {

                        logger.info(ruta + 'Atención: ' + mensaje);
                        res.json({
                            estatus: false,
                            mensaje,
                            FechasDisponibles: []
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
 * Consulta - Horarios disponibles por fecha
 ****************************************************************************/
app.get('/horas-disponibles', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: horas-disponibles';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        let citaModel = new CitaModel({
            IdUsuario: pUsuarioOperacion || '',
            IdTaller: req.query.IdTaller || 0,
            Fecha: req.query.Fecha || '',
        });

        if (citaModel.IdTaller == 0 || citaModel.Fecha == '') {
            mensaje = 'Verifique la información requerida.';
            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });
        } else {

            cita.consultaHorasDisponibles(citaModel)
                .then(result => {
                    let resultado = JSON.stringify(result);
                    let datos = JSON.parse(resultado);

                    ok = datos.estatus;
                    mensaje = datos.mensaje;

                    if (ok) {

                        res.json({
                            estatus: true,
                            mensaje,
                            HorasDisponibles: datos.HorasDisp
                        });

                    } else {

                        logger.info(ruta + 'Atención: ' + mensaje);
                        res.json({
                            estatus: false,
                            mensaje,
                            HorasDisponibles: []
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
 * Citas por Vehículo y fecha
 ****************************************************************************/
app.get('/citas', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: citas';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        let citaModel = new CitaModel({
            IdUsuario: pUsuarioOperacion || '',
            IdVehiculo: req.query.IdVehiculo || 0,
            Fecha: req.query.Fecha || ''
        });

        if (citaModel.IdVehiculo == 0 || citaModel.Fecha == '') {
            mensaje = 'Verifique la información requerida.';
            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });
        } else {
            cita.consultaCita(citaModel)
                .then(result => {
                    let resultado = JSON.stringify(result);
                    let datos = JSON.parse(resultado);

                    ok = datos.estatus;
                    mensaje = datos.mensaje;

                    if (ok) {

                        res.json({
                            estatus: true,
                            mensaje,
                            citas: datos.citas
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
            estatus: false,
            error: err.message
        });

    }
});

/****************************************************************************
 * Edición - Cita
 ****************************************************************************/
app.post('/cita-registro', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: cita-registro';
        logger.info(etiquetaLOG);

        let body = req.body;
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        let citaModel = new CitaModel({
            IdUsuario: pUsuarioOperacion || '',
            IdVehiculo: body.IdVehiculo || 0,
            IdConcesionario: body.IdConcesionario || 0,
            IdTaller: body.IdTaller || 0,
            Fecha: body.Fecha || ''
        });

        logger.info('Datos de entrada');
        logger.info(JSON.stringify(citaModel));

        if (citaModel.IdVehiculo == 0 || citaModel.IdConcesionario == 0 || citaModel.IdTaller == 0 || citaModel.Fecha == '') {
            mensaje = 'Verifique la información requerida.';

            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });
        } else {
            cita.registraCita(citaModel)
                .then(result => {

                    let resultado = JSON.stringify(result);
                    let datos = JSON.parse(resultado);

                    ok = datos.estatus;
                    mensaje = datos.mensaje + ' ' + datos.mensajeDet;

                    if (!ok) {
                        logger.info(ruta + 'Atención: ' + mensaje);
                    }

                    res.json({
                        estatus: ok,
                        mensaje: datos.mensaje + ' ' + datos.mensajeDet,
                        IdCita: datos.IdCita
                    });

                }, (err) => {

                    logger.error(ruta + 'ERROR: ' + err);
                    res.json({
                        estatus: false,
                        mensaje: err
                    });

                }).catch((err) => setImmediate(() => {
                    res.json({
                        estatus: false,
                        error: err.message
                    });
                }));

        }

    } catch (err) {
        logger.error(ruta + 'ERROR: ' + err);

        res.json({
            estatus: false,
            error: err.message
        });

    }
});
/****************************************************************************/
app.post('/cita-cancelacion', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: cita-cancelacion';
        logger.info(etiquetaLOG);

        let body = req.body;
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        let citaModel = new CitaModel({
            IdUsuario: pUsuarioOperacion || '',
            IdVehiculo: body.IdVehiculo || 0,
            IdCita: body.IdCita || 0
        });

        if (citaModel.IdVehiculo == 0 || citaModel.IdCita == 0) {
            mensaje = 'Verifique la información requerida.';

            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });
        } else {
            cita.cancelaCita(citaModel)
                .then(result => {

                    let resultado = JSON.stringify(result);
                    let datos = JSON.parse(resultado);

                    ok = datos.estatus;
                    mensaje = datos.mensaje + ' ' + datos.mensajeDet;

                    if (!ok) {
                        logger.info(ruta + 'Atención: ' + mensaje);
                    }

                    res.json({
                        estatus: ok,
                        mensaje: datos.mensaje + ' ' + datos.mensajeDet,
                        IdCita: datos.IdCita
                    });

                }, (err) => {

                    logger.error(ruta + 'ERROR: ' + err);
                    res.json({
                        estatus: false,
                        mensaje: err
                    });

                }).catch((err) => setImmediate(() => {
                    res.json({
                        estatus: false,
                        error: err.message
                    });
                }));

        }

    } catch (err) {
        logger.error(ruta + 'ERROR: ' + err);

        res.json({
            estatus: false,
            error: err.message
        });

    }
});

/****************************************************************************/
app.post('/cita-dictamen', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: cita-dictamen';
        logger.info(etiquetaLOG);

        let body = req.body;
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        let citaModel = new CitaModel({
            IdUsuario: pUsuarioOperacion || '',
            IdCita: body.IdCita || 0,
            IdVehiculo: body.IdVehiculo || 0,
            IdConcesionario: body.IdConcesionario || 0,
            IdDictamen: body.IdDictamen || 0,
            Observaciones: body.Observaciones || ''
        });

        if (citaModel.IdVehiculo == 0 || citaModel.IdConcesionario == 0 || citaModel.IdDictamen == 0) {
            mensaje = 'Verifique la información requerida.';

            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });
        } else {
            cita.dictaminaCita(citaModel)
                .then(result => {

                    let resultado = JSON.stringify(result);
                    let datos = JSON.parse(resultado);

                    ok = datos.estatus;
                    mensaje = datos.mensaje + ' ' + datos.mensajeDet;

                    if (!ok) {
                        logger.info(ruta + 'Atención: ' + mensaje);
                    }

                    res.json({
                        estatus: ok,
                        mensaje: datos.mensaje + ' ' + datos.mensajeDet,
                        IdCita: datos.IdCita
                    });

                }, (err) => {

                    logger.error(ruta + 'ERROR: ' + err);
                    res.json({
                        estatus: false,
                        mensaje: err
                    });

                }).catch((err) => setImmediate(() => {
                    res.json({
                        estatus: false,
                        error: err.message
                    });
                }));

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
 * Consulta Cita por ID
 ****************************************************************************/
app.get('/cita-id', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: cita-id';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        let citaModel = new CitaModel({
            IdUsuario: pUsuarioOperacion || '',
            IdCita: req.query.IdCita || 0
        });

        if (citaModel.IdCita == 0) {
            mensaje = 'Verifique la información requerida.';
            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });
        } else {
            cita.consultaCitaId(citaModel)
                .then(result => {
                    let resultado = JSON.stringify(result);
                    let datos = JSON.parse(resultado);

                    ok = datos.estatus;
                    mensaje = datos.mensaje;

                    if (ok) {

                        res.json({
                            estatus: true,
                            mensaje,
                            cita: datos.cita
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
            estatus: false,
            error: err.message
        });

    }
});

module.exports = app;