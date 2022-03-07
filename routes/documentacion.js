const express = require('express');
const app = express();

const logger = require('../log/log');

const { verificaToken } = require('../middleware/autenticacion');

const { DocumentoModel } = require('../models/documento.model');

const documento = require('../dao/documentacion.dao');

const ruta = ' [documentacion.js] ';

const multer = require('multer');
const mimeTypes = require('mime-types');

const storage = multer.diskStorage({
    destination: documentos,
    filename: function(req, file, cb) {
        cb("", file.originalname.substring(0, file.originalname.length - 4) + '_' + Date.now() + '.pdf');
    }
});

const upload = multer({ storage: storage });

/****************************************************************************
 * Consulta - Documentos de Vehículo PreRegistro
 ****************************************************************************/
app.get('/vehiculo-documentos', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: vehiculo-documentos';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        let documentoModel = new DocumentoModel({
            IdUsuario: pUsuarioOperacion || '',
            IdVehiculo: req.query.IdVehiculo || 0
        });

        if (documentoModel.IdVehiculo == 0) {
            mensaje = 'Verifique la información requerida.';
            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });
        } else {

            documento.consultaDocumentacion(documentoModel)
                .then(result => {
                    let resultado = JSON.stringify(result);
                    let datos = JSON.parse(resultado);

                    ok = datos.estatus;
                    mensaje = datos.mensaje;

                    if (ok) {

                        res.json({
                            estatus: true,
                            mensaje,
                            documentos: datos.documentos
                        });

                    } else {

                        logger.info(ruta + 'Atención: ' + mensaje);
                        res.json({
                            estatus: false,
                            mensaje,
                            documentos: []
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
 * Edición de documento de Vehículo PreRegistro
 ****************************************************************************/
app.post('/documento-edicion', verificaToken, upload.single('Documento'), (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: documento-edicion';
        logger.info(etiquetaLOG);

        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;
        let body = req.body;

        let NombreArchivoPDF = '';

        let documentoModel = new DocumentoModel({
            IdUsuario: pUsuarioOperacion || '',
            IdConcesionario: body.IdConcesionario || 0,
            IdVehiculo: body.IdVehiculo || 0,
            IdDocumento: body.IdDocumento || 0
        });
        logger.info('body--->');
        logger.info(JSON.stringify(body));


        if (documentoModel.IdVehiculo == 0 || documentoModel.IdDocumento == 0 || documentoModel.IdConcesionario == 0) {
            mensaje = 'Verifique la información requerida.';
            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });

        } else {

            if (!req.file) {

                res.json({
                    ok: false,
                    mensaje: 'El archivo del documento es requerido'
                });
            } else {

                logger.info('req.file');
                logger.info(JSON.stringify(req.file));

                //NombreArchivoPDF = req.file.originalname;
                NombreArchivoPDF = req.file.filename;

                let documentoModelR = new DocumentoModel({
                    Accion: 'E',
                    IdUsuario: pUsuarioOperacion || '',
                    IdVehiculo: documentoModel.IdVehiculo || 0,
                    IdDocumento: documentoModel.IdDocumento || 0,
                    IdConcesionario: documentoModel.IdConcesionario || 0,
                    NombreArchivo: NombreArchivoPDF
                });


                logger.info('NombreArchivoPDF');
                logger.info(NombreArchivoPDF);

                documento.editaDocumento(documentoModelR)
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
                            mensaje: datos.mensaje + ' ' + datos.mensajeDet
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
        }

    } catch (err) {
        logger.error(`${ruta} ERROR: ${err}`);

        res.json({
            ok: false,
            mensaje: err.message,
            codigo: codRespuesta.error
        });

    }

});

/****************************************************************************
 * Eliminar un documento de Vehículo PreRegistro
 ****************************************************************************/
app.post('/documento-anulacion', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: documento-anulacion';
        logger.info(etiquetaLOG);

        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;
        let body = req.body;

        let documentoModel = new DocumentoModel({
            Accion: 'B',
            IdUsuario: pUsuarioOperacion || '',
            IdVehiculo: body.IdVehiculo || 0,
            IdDocumento: body.IdDocumento || 0
        });

        if (documentoModel.IdVehiculo == 0 || documentoModel.IdDocumento == 0) {
            mensaje = 'Verifique la información requerida.';
            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });

        } else {

            documento.editaDocumento(documentoModel)
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
                        mensaje: datos.mensaje + ' ' + datos.mensajeDet
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
        logger.error(`${ruta} ERROR: ${err}`);

        res.json({
            ok: false,
            mensaje: err.message,
            codigo: codRespuesta.error
        });

    }

});

/****************************************************************************
 * Consulta - Documentos de Vehículo Registro
 ****************************************************************************/
app.get('/documentos-contrato', verificaToken, (req, res) => {

    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: documentos-contrato';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;

        let mensaje = '';
        let ok = false;

        let documentoModel = new DocumentoModel({
            IdUsuario: pUsuarioOperacion || '',
            IdVehiculo: req.query.IdVehiculo || 0
        });

        if (documentoModel.IdVehiculo == 0) {
            mensaje = 'Verifique la información requerida.';
            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });
        } else {

            documento.consultaDocumentosRegistro(documentoModel)
                .then(result => {
                    let resultado = JSON.stringify(result);
                    let datos = JSON.parse(resultado);

                    ok = datos.estatus;
                    mensaje = datos.mensaje;

                    if (ok) {

                        res.json({
                            estatus: true,
                            mensaje,
                            documentos: datos.documentos
                        });

                    } else {

                        logger.info(ruta + 'Atención: ' + mensaje);
                        res.json({
                            estatus: false,
                            mensaje,
                            documentos: []
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
 * Edición de documento de Vehículo Registro
 ****************************************************************************/
app.post('/documento-digitaliacion', verificaToken, upload.single('Documento'), (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: documento-digitaliacion';
        logger.info(etiquetaLOG);

        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;
        let body = req.body;

        let NombreArchivoPDF = '';

        let documentoModel = new DocumentoModel({
            IdUsuario: pUsuarioOperacion || '',
            IdConcesionario: body.IdConcesionario || 0,
            IdVehiculo: body.IdVehiculo || 0,
            IdDocumento: body.IdDocumento || 0
        });
        logger.info('body--->');
        logger.info(JSON.stringify(body));


        if (documentoModel.IdVehiculo == 0 || documentoModel.IdDocumento == 0 || documentoModel.IdConcesionario == 0) {
            mensaje = 'Verifique la información requerida.';
            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });

        } else {

            if (!req.file) {

                res.json({
                    ok: false,
                    mensaje: 'El archivo del documento es requerido'
                });
            } else {

                logger.info('req.file');
                logger.info(JSON.stringify(req.file));

                NombreArchivoPDF = req.file.filename;

                let documentoModelR = new DocumentoModel({
                    IdUsuario: pUsuarioOperacion || '',
                    IdConcesionario: documentoModel.IdConcesionario || 0,
                    IdVehiculo: documentoModel.IdVehiculo || 0,
                    IdDocumento: documentoModel.IdDocumento || 0,
                    NombreArchivo: NombreArchivoPDF
                });

                logger.info('NombreArchivoPDF');
                logger.info(NombreArchivoPDF);

                documento.digitalizaDocumento(documentoModelR)
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
                            mensaje: datos.mensaje + ' ' + datos.mensajeDet
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
        }

    } catch (err) {
        logger.error(`${ruta} ERROR: ${err}`);

        res.json({
            ok: false,
            mensaje: err.message,
            codigo: codRespuesta.error
        });

    }

});

/****************************************************************************
 * Edición de documento de Vehículo Registro
 ****************************************************************************/
app.post('/documento-verificacion', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.IdUsuario + '] METODO: documento-verificacion';
        logger.info(etiquetaLOG);

        // Del token
        let pUsuarioOperacion = req.usuario.IdUsuario;
        let body = req.body;

        let documentoModel = new DocumentoModel({
            IdUsuario: pUsuarioOperacion || '',
            IdConcesionario: body.IdConcesionario || 0,
            IdVehiculo: body.IdVehiculo || 0,
            IdDocumento: body.IdDocumento || 0,
            Correcto: body.Correcto || 0,
            Observaciones: body.Observaciones || ''
        });

        logger.info('documentoModel--->');
        logger.info(JSON.stringify(documentoModel));

        if (documentoModel.IdConcesionario == 0, documentoModel.IdVehiculo == 0 ||
            documentoModel.IdDocumento == 0) {
            mensaje = 'Verifique la información requerida.';
            logger.info(ruta + 'Atención: ' + mensaje);
            res.json({
                estatus: false,
                mensaje
            });

        } else {

            documento.verificaDocumento(documentoModel)
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
                        mensaje: datos.mensaje + ' ' + datos.mensajeDet
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
        logger.error(`${ruta} ERROR: ${err}`);

        res.json({
            ok: false,
            mensaje: err.message,
            codigo: codRespuesta.error
        });

    }

});

module.exports = app;