const express = require('express');
const Logger = require('nodemon/lib/utils/log');

const logger = require('../log/log');

const { VehiculoModel } = require('../models/vehiculo.model');

const utils = require('../utils/utils');

const ruta = ' [vehiculo.dao.js] ';

/* ********** busqueda de Concesionario por RFC   ********** */
function consultaVehiculo(entrada) {
    let etiquetaLOG = ruta + ' FUNCION: consultaVehículo';
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let resul = [];
        let vehiculos = [];
        let numReg = 0;


        BdConsultaVehiculo(entrada.IdVehiculo, entrada.IdUsuario)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);

                numReg = datos.length;

                if (numReg > 0) {

                    let vehiculo = new VehiculoModel({
                        IdConcesionario: datos[0].IdConcesionario,
                        IdPropietario: datos[0].IdPropietario,
                        VIN: datos[0].VIN,
                        IdMarca: datos[0].IdMarca,
                        Marca: datos[0].Marca,
                        IdSubmarca: datos[0].IdSubmarca,
                        Submarca: datos[0].Submarca,
                        Modelo: datos[0].Modelo,
                        Placa: datos[0].Placa,
                        Arrendado: datos[0].Arrendado,
                        Estatus: datos[0].Estatus,
                        Color: datos[0].Color,
                        IdRepresentante: datos[0].IdRepresentante
                    });

                    vehiculos.push(vehiculo);

                }

                resul = {
                    estatus: true,
                    mensaje: 'Consulta exitosa',
                    vehiculos
                }

                resolve(resul);

            }).catch((err) => setImmediate(() => {
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al consultar el Vehículo: ${err}`);
    });
}

/* ********** Edita un Vehiculo   ********** */
function editaVehiculo(Entrada) {

    let etiquetaLOG = `${ ruta }[Usuario: ${Entrada.IdUsuario}] METODO: editaVehiculo `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let ok = false;
        let mensaje = '';
        let mensajeDet = '';


        let query_str = '';

        query_str = `CALL spVehiculo(
        ${utils.paramSP(Entrada.IdVehiculo,'N')},  
        ${utils.paramSP(Entrada.IdConcesionario,'N')}, 
        ${utils.paramSP(Entrada.VIN,'S')},
        ${utils.paramSP(Entrada.IdSubmarca,'N')},
        ${utils.paramSP(Entrada.Modelo,'N')},
        ${utils.paramSP(Entrada.Placa,'S')},
        ${utils.paramSP(Entrada.Color,'S')}
        )`;

        BdEdicionVehiculo(query_str, Entrada.IdUsuario)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);

                ok = datos[0].resultado;
                mensaje = datos[0].mensaje;
                mensajeDet = datos[0].mensajeDet;
                IdVehiculo = datos[0].IdVehiculo;

                resul = {
                    estatus: ok,
                    mensaje,
                    mensajeDet,
                    IdVehiculo
                }

                resolve(resul);

            }).catch((err) => setImmediate(() => {
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al editar el Vehiculo: ${err}`);
    });
}

/****************************************************************/
/**************    B A S E     D E    D A T O S    **************/
/****************************************************************/
function BdConsultaVehiculo(IdVehiculo, Usuario) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ Usuario }] METODO: BdConsultaVehiculo `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        var query_str = `CALL spConsultaVehiculo(${IdVehiculo})`;

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
        throw (`Se presentó un error en BdConsultaVehiculo: ${err}`);
    });

}

/****************************************************************/
function BdEdicionVehiculo(pQuery_str, Usuario) {

    let etiquetaLOG = `${ ruta }[Usuario: ${Usuario }] METODO: BdEdicionVehiculo `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        logger.info(pQuery_str);

        con.query(pQuery_str, function(err, rows) {

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
        throw (`Se presentó un error en BdEdicionVehiculo: ${err}`);
    });

}

/****************************************************************/

module.exports = { editaVehiculo, consultaVehiculo };