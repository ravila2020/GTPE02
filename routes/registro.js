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

/****************************************************************************
 * Edición - Operador
 ****************************************************************************/
app.post('/operador-edicion', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: operador-edicion';
        logger.info(etiquetaLOG);

        let body = req.body;
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;
        let IdOperador = 0;

        let personaModel = new PersonaModel({
            IdUsuario: pUsuarioOperacion || '',
            IdOperador: body.IdOperador || 0,
            IdConcesionario: body.IdConcesionario || 0,
            Nombre: body.Nombre || '',
            Paterno: body.Paterno || '',
            Materno: body.Materno || '',
            RFC: body.RFC || '',
            CURP: body.CURP || '',
            IdIdentificacion: body.IdIdentificacion || '',
            FolioIdentificacion: body.FolioIdentificacion || '',
            FechaNacimiento: body.FechaNacimiento || '',
            TipoPersona: body.TipoPersona || '',
            Genero: body.Genero || '',
            EstadoCivil: body.EstadoCivil || '',
            Calle: body.Calle || '',
            Exterior: body.Exterior || '',
            Interior: body.Interior || '',
            IdColonia: body.IdColonia || '',
            Telefono: body.Telefono || '',
            Celular: body.Celular || '',
            email: body.email || '',
            IdVehiculo: body.IdVehiculo || 0,
            Licencia: body.Licencia || ''
        });

        logger.info('Datos de entrada');
        logger.info(JSON.stringify(personaModel));

        if (personaModel.Nombre == '' || personaModel.RFC == '' || personaModel.TipoPersona == '' || personaModel.Genero == '' ||
            personaModel.IdVehiculo == 0, personaModel.IdConcesionario == 0) {
            mensaje = 'Verifique la información requerida.';
            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });
        } else {
            persona.edicionOperador(personaModel)
                .then(result => {

                    let resultado = JSON.stringify(result);
                    let datos = JSON.parse(resultado);

                    ok = datos.estatus;
                    mensaje = datos.mensaje + ' ' + datos.mensajeDet;
                    IdOperador = datos.IdOperador;

                    if (!ok) {

                        logger.info(ruta + 'Atención: ' + mensaje);

                    }

                    res.json({
                        estatus: ok,
                        mensaje: datos.mensaje + ' ' + datos.mensajeDet,
                        IdOperador
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
 * Edición - Operador
 ****************************************************************************/
app.post('/operador-estatus', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: operador-estatus';
        logger.info(etiquetaLOG);

        let body = req.body;
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;
        let IdOperador = 0;

        let personaModel = new PersonaModel({
            IdUsuario: pUsuarioOperacion || '',
            IdOperador: body.IdOperador || 0,
            IdVehiculo: body.IdVehiculo || 0,
            Estatus: body.Estatus || ''
        });

        logger.info('Datos de entrada');
        logger.info(JSON.stringify(personaModel));

        if (personaModel.Nombre == '' || personaModel.RFC == '' || personaModel.TipoPersona == '' || personaModel.Genero == '' ||
            personaModel.IdVehiculo == 0, personaModel.IdConcesionario == 0) {
            mensaje = 'Verifique la información requerida.';
            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });
        } else {
            persona.edicionOperador(personaModel)
                .then(result => {

                    let resultado = JSON.stringify(result);
                    let datos = JSON.parse(resultado);

                    ok = datos.estatus;
                    mensaje = datos.mensaje + ' ' + datos.mensajeDet;
                    IdOperador = datos.IdOperador;

                    if (!ok) {

                        logger.info(ruta + 'Atención: ' + mensaje);

                    }

                    res.json({
                        estatus: ok,
                        mensaje: datos.mensaje + ' ' + datos.mensajeDet,
                        IdOperador
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

module.exports = app;