const express = require('express');

const app = express();

const logger = require('../log/log');

const { SindicatosModel, Reporte1Model } = require('../models/reportes.model');

const ruta = ' [reportes.dao.js] ';

/* ********** obtieneListaSindicatos ********** */
function obtieneSindicatos(entrada) {

    let etiquetaLOG = ruta + ' FUNCION: obtieneSindicatos';
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let resul = [];
        let sindicatos = [];
        let numReg = 0;

        BdConsultaSindicatos(entrada.Estatus, entrada.IdUsuario)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);

                numReg = datos.length;

                if (numReg > 0) {

                    if (entrada.TipoConsulta == 'Lista') {
                        for (var i = 0, l = datos.length; i < l; i++) {
                            var elemento = {
                                IdSindicato: datos[i].IdSindicato,
                                Nombre: datos[i].Nombre
                            }

                            sindicatos.push(elemento);
                        }
                    } else {

                        for (var i = 0, l = datos.length; i < l; i++) {
                            const sindicato = new SindicatosModel({
                                IdSindicato: datos[i].IdSindicato,
                                Nombre: datos[i].Nombre,
                                Seccion: datos[i].Seccion,
                                Responsable: datos[i].Responsable,
                                Direccion: datos[i].Direccion,
                                Region: datos[i].Region,
                                Estatus: datos[i].Estatus
                            });
                            sindicatos.push(sindicato);

                        }
                    }

                    resul = {
                        estatus: true,
                        mensaje: 'Consulta exitosa',
                        sindicatos
                    }

                } else {

                    resul = {
                        estatus: false,
                        mensaje: 'No se encontró información',
                        sindicatos: [],
                        codigo: codRespuesta.noDatos
                    }

                }
                resolve(resul);


            }).catch((err) => setImmediate(() => {
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al obtener los sindicatos: ${err}`);
    });
}
/* ********** obtieneReporte1 -----  Situación Actual Concesionarios ********** */
function obtieneReporte1(entrada) {
    // Situación Actual Concesionarios
    let etiquetaLOG = ruta + ' FUNCION: obtieneReporte1';
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let resul = [];
        let datosReporte = [];
        let numReg = 0;

        BdConsultaReporte1(entrada.IdSindicato, entrada.IdUsuario)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);

                numReg = datos.length;

                if (numReg > 0) {

                    for (var i = 0, l = datos.length; i < l; i++) {
                        const datReporte = new Reporte1Model({
                            IdPersona: datos[i].IdPersona,
                            Concesionario: datos[i].Concesionario,
                            Marca: datos[i].Marca,
                            Submarca: datos[i].Submarca,
                            Modelo: datos[i].Modelo,
                            VIN: datos[i].VIN,
                            Placa: datos[i].Placa,
                            Sindicato: datos[i].Sindicato,
                            PorcAhorroConcesion: datos[i].PorcAhorroConcesion,
                            PorcAhorroPropietario: datos[i].PorcAhorroPropietario,
                            PorcAhorroOperador: datos[i].PorcAhorroOperador,
                            FechaInicio: datos[i].FechaInicio,
                            FechaTermino: datos[i].FechaTermino,
                            TotalLitrosConsumir: datos[i].TotalLitrosConsumir,
                            TotalLitrosMes: datos[i].TotalLitrosMes,
                            LitrosConsumidos: datos[i].LitrosConsumidos,
                            LitrosXConsumir: datos[i].LitrosXConsumir,
                            ImporteBeneficiosConversion: datos[i].ImporteBeneficiosConversion,
                            TotalAhorro: datos[i].TotalAhorro,
                            TotalUtilizadoAhorro: datos[i].TotalUtilizadoAhorro,
                            TotalAhorroRestante: datos[i].TotalAhorroRestante
                        });
                        datosReporte.push(datReporte);
                    }

                    resul = {
                        estatus: true,
                        mensaje: 'Consulta exitosa',
                        reporte: datosReporte
                    }

                } else {

                    resul = {
                        estatus: false,
                        mensaje: 'No se encontró información',
                        reporte: [],
                        codigo: codRespuesta.noDatos
                    }

                }
                resolve(resul);


            }).catch((err) => setImmediate(() => {
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al obtener el reporte: ${err}`);
    });
}

/****************************************************************/
/**************    B A S E     D E    D A T O S    **************/
/****************************************************************/

function BdConsultaSindicatos(Estatus, Usuario) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ Usuario }] METODO: BdConsultaSindicatos `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        var query_str = `CALL spConsultaSindicatos('${Estatus}')`;
        /*
                logger.info('query_str');
                logger.info(query_str);
        */
        con.query(query_str, function(err, rows, fields) {

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
        throw (`Se presentó un error en BdConsultaSindicatos: ${err}`);
    });

}

function BdConsultaReporte1(Sindicato, Usuario) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ Usuario }] METODO: BdConsultaReporte1 `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        var query_str = `CALL spConsultaSituacionActualXSindicato(${Sindicato})`;

        // logger.info(query_str);

        con.query(query_str, function(err, rows, fields) {

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
        throw (`Se presentó un error en BdConsultaReporte1: ${err}`);
    });

}

/****************************************************************/

module.exports = { obtieneSindicatos, obtieneReporte1 };