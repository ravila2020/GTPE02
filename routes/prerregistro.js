const express = require('express');
const app = express();

const logger = require('../log/log');

const { verificaToken } = require('../middleware/autenticacion');

const { ParametrosModel } = require('../models/parametros.model');
const { PersonaModel } = require('../models/persona.model');
const { VehiculoModel } = require('../models/vehiculo.model');

const persona = require('../dao/persona.dao');
const vehiculo = require('../dao/vehiculo.dao');

const ruta = ' [prerregistro.js] ';

/****************************************************************************
 * Concesionarios por RFC
 ****************************************************************************/
app.get('/concesionario-rfc', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: concesionario-rfc';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        const parametrosModel = new ParametrosModel({
            IdUsuario: pUsuarioOperacion || '',
            RFC: req.query.RFC || ''
        });

        if (parametrosModel.RFC == '') {
            mensaje = 'El RFC es requerido.';
            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });
        } else {
            persona.consultaConcesionarioRFC(parametrosModel)
                .then(result => {
                    let resultado = JSON.stringify(result);
                    let datos = JSON.parse(resultado);

                    ok = datos.estatus;
                    mensaje = datos.mensaje;

                    if (ok) {

                        res.json({
                            estatus: true,
                            mensaje,
                            concesionario: datos.concesionario
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
 * Consulta - Concesionarios Pre Registro
 ****************************************************************************/
app.get('/concesionario-prerregistro', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: concesionario-prerregistro';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        const parametrosModel = new ParametrosModel({
            IdUsuario: pUsuarioOperacion || ''
        });

        persona.consultaConcesionarioPrerreg(parametrosModel)
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
 * Edición - Concesionario
 ****************************************************************************/
app.post('/concesionario-edicion', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: concesionario-edicion';
        logger.info(etiquetaLOG);

        let body = req.body;
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;
        let IdConcesionario = 0;

        let personaModel = new PersonaModel({
            IdUsuario: pUsuarioOperacion || '',
            IdPersona: body.IdConcesionario || 0,
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
            IdSindicato: body.IdSindicato || 0,
            IdAsignacionSindicato: body.IdAsignacionSindicato || 0,
            NumeroConcesion: body.NumeroConcesion || '',
            IdVehiculo: body.IdVehiculo || 0,
            Licencia: body.Licencia || '',
            Estatus: body.Estatus || ''
        });

        logger.info('Datos de entrada');
        logger.info(JSON.stringify(personaModel));

        if (personaModel.Nombre == '' || personaModel.RFC == '' || personaModel.TipoPersona == '' || personaModel.Genero == '' ||
            personaModel.IdSindicato == 0 || personaModel.IdAsignacionSindicato == 0) {
            mensaje = 'Verifique la información requerida.';
            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });
        } else {
            persona.edicionConcesionario(personaModel)
                .then(result => {

                    logger.info('result');
                    logger.info(result);
                    logger.info(JSON.stringify(result));

                    let resultado = JSON.stringify(result);
                    let datos = JSON.parse(resultado);

                    ok = datos.estatus;
                    mensaje = datos.mensaje + ' ' + datos.mensajeDet;
                    IdConcesionario = datos.IdConcesionario;

                    if (!ok) {

                        logger.info(ruta + 'Atención: ' + mensaje);

                    }

                    res.json({
                        estatus: ok,
                        mensaje: datos.mensaje + ' ' + datos.mensajeDet,
                        IdConcesionario
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
 * Consulta Concesionario por IdConcesionario y IdVehiculo 
 ****************************************************************************/
app.get('/concesionario-vehiculo', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: concecionario-vehiculo';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        let parametrosModel = new ParametrosModel({
            IdUsuario: pUsuarioOperacion || '',
            IdPersona: req.query.IdConcesionario || 0,
            IdVehiculo: req.query.IdVehiculo || 0
        });

        if (parametrosModel.IdPersona == 0 || parametrosModel.IdVehiculo == 0) {
            mensaje = 'Verifique la información requerida.';
            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });
        } else {

            persona.consultaConcesionarioVehiculo(parametrosModel)
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
 * Edición - Vehículo
 ****************************************************************************/
app.post('/vehiculo-edicion', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: vehiculo-edicion';
        logger.info(etiquetaLOG);

        let body = req.body;
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;
        let IdVehiculo = 0;

        let vehiculoModel = new VehiculoModel({
            IdUsuario: pUsuarioOperacion || '',
            IdVehiculo: body.IdVehiculo || 0,
            IdConcesionario: body.IdConcesionario || 0,
            VIN: body.VIN || '',
            IdSubmarca: body.IdSubmarca || 0,
            Modelo: body.Modelo || 0,
            Placa: body.Placa || '',
            Color: body.Color || ''

        });

        if (vehiculoModel.IdConcesionario == 0 ||
            vehiculoModel.VIN == '' || vehiculoModel.IdSubmarca == 0 || vehiculoModel.Modelo == 0 ||
            vehiculoModel.Placa == '') {
            mensaje = 'Verifique la información requerida.';

            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });
        } else {
            vehiculo.editaVehiculo(vehiculoModel)
                .then(result => {

                    let resultado = JSON.stringify(result);
                    let datos = JSON.parse(resultado);

                    ok = datos.estatus;
                    mensaje = datos.mensaje + ' ' + datos.mensajeDet;
                    IdVehiculo = datos.IdVehiculo;

                    if (!ok) {

                        logger.info(ruta + 'Atención: ' + mensaje);

                    }

                    res.json({
                        estatus: ok,
                        mensaje: datos.mensaje + ' ' + datos.mensajeDet,
                        IdVehiculo
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
 * Consulta Vehículo por IdVehiculo 
 ****************************************************************************/
app.get('/vehiculo', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: vehiculo';
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

            vehiculo.consultaVehiculo(parametrosModel)
                .then(result => {
                    let resultado = JSON.stringify(result);
                    let datos = JSON.parse(resultado);

                    ok = datos.estatus;
                    mensaje = datos.mensaje;

                    if (ok) {

                        res.json({
                            estatus: true,
                            mensaje,
                            vehiculo: datos.vehiculos
                        });

                    } else {

                        logger.info(ruta + 'Atención: ' + mensaje);
                        res.json({
                            estatus: false,
                            mensaje,
                            vehiculo: []
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
 * Concesionarios por RFC
 ****************************************************************************/
app.get('/propietario-rfc', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: propietario-rfc';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        const parametrosModel = new ParametrosModel({
            IdUsuario: pUsuarioOperacion || '',
            RFC: req.query.RFC || ''
        });

        if (parametrosModel.RFC == '') {
            mensaje = 'El RFC es requerido.';
            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });
        } else {
            persona.consultaPropietarioRFC(parametrosModel)
                .then(result => {
                    let resultado = JSON.stringify(result);
                    let datos = JSON.parse(resultado);

                    ok = datos.estatus;
                    mensaje = datos.mensaje;

                    if (ok) {

                        res.json({
                            estatus: true,
                            mensaje,
                            propietario: datos.propietario
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
 * Edición - Propietario
 ****************************************************************************/
app.post('/propietario-edicion', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: concesionario-edicion';
        logger.info(etiquetaLOG);

        let body = req.body;
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;
        let IdPropietario = 0;

        let personaModel = new PersonaModel({
            IdUsuario: pUsuarioOperacion || '',
            IdPersona: body.IdPropietario || 0,
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
            IdVehiculo: body.IdVehiculo || 0
        });

        if (personaModel.Nombre == '' || personaModel.RFC == '' || personaModel.TipoPersona == '' || personaModel.Genero == '' ||
            personaModel.IdVehiculo == 0) {
            mensaje = 'Verifique la información requerida.';
            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });
        } else {
            persona.edicionPropietario(personaModel)
                .then(result => {

                    logger.info('result');
                    logger.info(result);
                    logger.info(JSON.stringify(result));

                    let resultado = JSON.stringify(result);
                    let datos = JSON.parse(resultado);

                    ok = datos.estatus;
                    mensaje = datos.mensaje + ' ' + datos.mensajeDet;
                    IdPropietario = datos.IdPropietario;

                    if (!ok) {

                        logger.info(ruta + 'Atención: ' + mensaje);

                    }

                    res.json({
                        estatus: ok,
                        mensaje: datos.mensaje + ' ' + datos.mensajeDet,
                        IdPropietario
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
 * Consulta Propietario por IdPropietario y IdVehiculo 
 ****************************************************************************/
app.get('/propietario-vehiculo', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: propietario-vehiculo';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        const parametrosModel = new ParametrosModel({
            IdUsuario: pUsuarioOperacion || '',
            IdPersona: req.query.IdPropietario || 0,
            IdVehiculo: req.query.IdVehiculo || 0
        });


        if (parametrosModel.IdPersona == 0 || parametrosModel.IdVehiculo == 0) {
            mensaje = 'Verifique la información requerida.';
            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });
        } else {

            persona.consultaPropietarioVehiculo(parametrosModel)
                .then(result => {
                    let resultado = JSON.stringify(result);
                    let datos = JSON.parse(resultado);

                    ok = datos.estatus;
                    mensaje = datos.mensaje;

                    if (ok) {

                        res.json({
                            estatus: true,
                            mensaje,
                            propietario: datos.propietario
                        });

                    } else {

                        logger.info(ruta + 'Atención: ' + mensaje);
                        res.json({
                            estatus: false,
                            mensaje,
                            propietario: []
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