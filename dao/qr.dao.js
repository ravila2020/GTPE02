const express = require('express');

const app = express();

const logger = require('../log/log');

const { QrOperadorModel } = require('../models/qr.model');

const ruta = ' [qr.dao.js] ';

/* ********** consultaOperadoresQR  ********** */
function consultaOperadoresQR(entrada) {
    let etiquetaLOG = ruta + ' FUNCION: consultaOperadoresQR';
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let ok = false;
        let mensaje = '';

        let resul = [];
        let vehiculo = [];
        let datosV = [];
        let operadores = [];
        let numReg = 0;

        BdConsultaOperadoresQR(entrada.Placa, entrada.IdUsuario)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);

                numReg = datos.length;

                if (numReg > 0) {

                    ok = datos[0].resultado;
                    mensaje = datos[0].mensaje;

                    if (ok) {
                        for (var i = 0, l = datos.length; i < l; i++) {
                            var elemento = {
                                IdOperador: datos[i].IdOperador,
                                NombreOperador: datos[i].NombreOperador,
                                RFC: datos[i].RFC,
                                CURP: datos[i].CURP
                            }
                            operadores.push(elemento);
                        }

                        vehiculo = {
                            IdConcesionario: datos[0].IdConcesionario,
                            NombreConcesionario: datos[0].NombreConcesionario,
                            IdVehiculo: datos[0].IdVehiculo,
                            Modelo: datos[0].Modelo,
                            Serie: datos[0].Serie,
                            Placa: datos[0].Placa,
                            Operadores: operadores
                        }
                        datosV.push(vehiculo);
                        resul = {
                            estatus: true,
                            mensaje: 'Consulta exitosa',
                            vehiculo: datosV
                        }

                    } else {

                        resul = {
                            estatus: false,
                            mensaje,
                            vehiculo: []
                        }

                    }

                } else {

                    resul = {
                        estatus: false,
                        mensaje: 'No se encontró información',
                        vehiculo: [],
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
        throw (`Se presentó un error al consultar las placas: ${err}`);
    });
}

/****************************************************************/
/**************    B A S E     D E    D A T O S    **************/
/****************************************************************/
function BdConsultaOperadoresQR(Placa, Usuario) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ Usuario }] METODO: BdConsultaOperadoresQR `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        var query_str = `CALL spConsultaQR('${Placa}')`;

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
        throw (`Se presentó un error en BdConsultaOperadoresQR: ${err}`);
    });

}

/****************************************************************/


module.exports = { consultaOperadoresQR };