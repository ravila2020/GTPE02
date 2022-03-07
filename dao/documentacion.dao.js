const express = require('express');
const Logger = require('nodemon/lib/utils/log');

const logger = require('../log/log');

const { DocumentoModel } = require('../models/documento.model');

const utils = require('../utils/utils');

const ruta = ' [documentacion.dao.js] ';

/* ********** Consulta de la Documentación del Vehículo en PreRegistro   ********** */
function consultaDocumentacion(entrada) {
    let etiquetaLOG = ruta + ' FUNCION: consultaDocumentacion';
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let resul = [];
        let documentos = [];
        let numReg = 0;

        BdConsultaDocumentacion(entrada.IdVehiculo, entrada.IdUsuario)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);


                numReg = datos.length;

                if (numReg > 0) {

                    for (i = 0; i < numReg; i++) {
                        let documento = new DocumentoModel({
                            IdVehiculo: datos[i].IdVehiculo,
                            IdDocumento: datos[i].IdDocumento,
                            Documento: datos[i].Documento,
                            NombreArchivo: datos[i].NombreArchivo,
                            Faltante: datos[i].Faltante
                        });

                        documentos.push(documento);
                    }
                }

                resul = {
                    estatus: true,
                    mensaje: 'Consulta exitosa',
                    documentos
                }

                resolve(resul);

            }).catch((err) => setImmediate(() => {
                logger.info('err');
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al consultar la documentación del Vehículo: ${err}`);
    });
}

/* ********** Edita la documentación de un Vehiculo  en PreRegistro ********** */
function editaDocumento(Entrada) {

    let etiquetaLOG = `${ ruta }[Usuario: ${Entrada.IdUsuario}] METODO: editaDocumento `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let ok = false;
        let mensaje = '';
        let mensajeDet = '';

        BdEdicionDocumento(Entrada)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);

                ok = datos[0].resultado;
                mensaje = datos[0].mensaje;
                mensajeDet = datos[0].mensajeDet;

                resul = {
                    estatus: ok,
                    mensaje,
                    mensajeDet
                }

                resolve(resul);

            }).catch((err) => setImmediate(() => {
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al editar el documento: ${err}`);
    });
}

/* ********** Consulta de la Documentación del Vehículo en Registro   ********** */
function consultaDocumentosRegistro(entrada) {
    let etiquetaLOG = ruta + ' FUNCION: consultaDocumentosRegistro';
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let resul = [];
        let documentos = [];
        let numReg = 0;

        BdConsultaDocumentosRegistro(entrada.IdVehiculo, entrada.IdUsuario)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);


                numReg = datos.length;

                if (numReg > 0) {

                    for (i = 0; i < numReg; i++) {
                        let documento = new DocumentoModel({
                            IdVehiculo: datos[i].IdVehiculo,
                            IdDocumento: datos[i].IdDocumento,
                            Documento: datos[i].Documento,
                            NombreArchivo: datos[i].NombreArchivo,
                            Faltante: datos[i].Faltante,
                            Revisado: datos[i].Revisado,
                            Correcto: datos[i].Correcto,
                            Observaciones: datos[i].Observaciones
                        });

                        documentos.push(documento);
                    }
                }

                resul = {
                    estatus: true,
                    mensaje: 'Consulta exitosa',
                    documentos
                }

                resolve(resul);

            }).catch((err) => setImmediate(() => {
                logger.info('err');
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al consultar la documentación del Vehículo (Registro): ${err}`);
    });
}

/* ********** Digitaliza la documentación de un Vehiculo  en Registro ********** */
function digitalizaDocumento(Entrada) {

    let etiquetaLOG = `${ ruta }[Usuario: ${Entrada.IdUsuario}] METODO: digitalizaDocumento `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let ok = false;
        let mensaje = '';
        let mensajeDet = '';

        BdDigitalizaDocumento(Entrada)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);

                ok = datos[0].resultado;
                mensaje = datos[0].mensaje;
                mensajeDet = datos[0].mensajeDet;

                resul = {
                    estatus: ok,
                    mensaje,
                    mensajeDet
                }

                resolve(resul);

            }).catch((err) => setImmediate(() => {
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al editar el documento: ${err}`);
    });
}

/* ********** Verifica la documentación de un Vehiculo  en Registro ********** */
function verificaDocumento(Entrada) {

    let etiquetaLOG = `${ ruta }[Usuario: ${Entrada.IdUsuario}] METODO: verificaDocumento `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let ok = false;
        let mensaje = '';
        let mensajeDet = '';

        BdVerificaDocumento(Entrada)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);

                ok = datos[0].resultado;
                mensaje = datos[0].mensaje;
                mensajeDet = datos[0].mensajeDet;

                resul = {
                    estatus: ok,
                    mensaje,
                    mensajeDet
                }

                resolve(resul);

            }).catch((err) => setImmediate(() => {
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al verificar el documento: ${err}`);
    });
}

/****************************************************************/
/**************    B A S E     D E    D A T O S    **************/
/****************************************************************/
function BdConsultaDocumentacion(IdVehiculo, Usuario) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ Usuario }] METODO: BdConsultaDocumentacion `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        var query_str = `CALL spConsultaVehiculoDocumentacion(${IdVehiculo})`;

        logger.info(query_str);

        con.query(query_str, function(err, rows) {

            if (err) {
                if (err.message != 'connect ETIMEDOUT')
                    con.end();

                return reject(err);
            }

            con.end();
            resolve(rows[0]);
        });
    })

    .catch((err) => {
        throw (`Se presentó un error en BdConsultaDocumentacion: ${err}`);
    });

}

/****************************************************************/
function BdEdicionDocumento(Parametro) {

    let etiquetaLOG = `${ ruta }[Usuario: ${Parametro.IdUsuario }] METODO: BdEdicionDocumento `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let query_str = '';

        query_str = `CALL spVehiculoDocumento( '${Parametro.Accion}',
        ${utils.paramSP(Parametro.IdConcesionario,'N')},  
        ${utils.paramSP(Parametro.IdVehiculo,'N')},  
        ${utils.paramSP(Parametro.IdDocumento,'N')}, 
        ${utils.paramSP(Parametro.NombreArchivo,'S')}
        )`;

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        logger.info(query_str);

        con.query(query_str, function(err, rows) {

            if (err) {
                if (err.message != 'connect ETIMEDOUT')
                    con.end();

                return reject(err);
            }

            con.end();
            resolve(rows[0]);
        });
    })

    .catch((err) => {
        throw (`Se presentó un error en BdEdicionDocumento: ${err}`);
    });

}

/****************************************************************/
function BdConsultaDocumentosRegistro(IdVehiculo, Usuario) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ Usuario }] METODO: BdConsultaDocumentosRegistro `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        var query_str = `CALL spConsultaDocumentacionRegistro(${IdVehiculo})`;

        logger.info(query_str);

        con.query(query_str, function(err, rows) {

            if (err) {
                if (err.message != 'connect ETIMEDOUT')
                    con.end();

                return reject(err);
            }

            con.end();
            resolve(rows[0]);
        });
    })

    .catch((err) => {
        throw (`Se presentó un error en BdConsultaDocumentosRegistro: ${err}`);
    });

}

/****************************************************************/
function BdDigitalizaDocumento(Parametro) {

    let etiquetaLOG = `${ ruta }[Usuario: ${Parametro.IdUsuario }] METODO: BdDigitalizaDocumento `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let query_str = '';

        query_str = `CALL spDocumentoDigitalizar(
        ${utils.paramSP(Parametro.IdConcesionario,'N')},  
        ${utils.paramSP(Parametro.IdVehiculo,'N')},  
        ${utils.paramSP(Parametro.IdDocumento,'N')}, 
        ${utils.paramSP(Parametro.NombreArchivo,'S')}
        )`;

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        logger.info(query_str);

        con.query(query_str, function(err, rows) {

            if (err) {
                if (err.message != 'connect ETIMEDOUT')
                    con.end();

                return reject(err);
            }

            con.end();
            resolve(rows[0]);
        });
    })

    .catch((err) => {
        throw (`Se presentó un error en BdDigitalizaDocumento: ${err}`);
    });

}


/****************************************************************/
function BdVerificaDocumento(Parametro) {

    let etiquetaLOG = `${ ruta }[Usuario: ${Parametro.IdUsuario }] METODO: BdVerificaDocumento `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let query_str = '';

        query_str = `CALL spDocumentoCalificar(
        ${utils.paramSP(Parametro.IdConcesionario,'N')},  
        ${utils.paramSP(Parametro.IdVehiculo,'N')},  
        ${utils.paramSP(Parametro.IdDocumento,'N')}, 
        ${utils.paramSP(Parametro.IdUsuario,'S')},
        ${utils.paramSP(Parametro.Correcto,'N')},
        ${utils.paramSP(Parametro.Observaciones,'S')}
        )`;

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        logger.info(query_str);

        con.query(query_str, function(err, rows) {

            if (err) {
                if (err.message != 'connect ETIMEDOUT')
                    con.end();

                return reject(err);
            }

            con.end();
            resolve(rows[0]);
        });
    })

    .catch((err) => {
        throw (`Se presentó un error en BdVerificaDocumento: ${err}`);
    });

}

/****************************************************************/

module.exports = {
    consultaDocumentacion,
    editaDocumento,
    consultaDocumentosRegistro,
    digitalizaDocumento,
    verificaDocumento
};