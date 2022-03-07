const express = require('express');
const { json } = require('express/lib/response');

const logger = require('../log/log');

const { ContratoDatosModel } = require('../models/contrato.model');

const utils = require('../utils/utils');

const ruta = ' [contrato.dao.js] ';


/* ********** Muestra datos para la generación del contrato   ********** */
function consultaDatosContrato(entrada) {
    let etiquetaLOG = ruta + ' FUNCION: consultaDatosContrato';
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {
        let mensaje = '';
        let contrato = [];
        let resul = [];

        BdConsultaDatosContrato(entrada.IdVehiculo, entrada.IdUsuario)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);

                numReg = datos.length;

                if (numReg > 0) {
                    const contratoDat = new ContratoDatosModel({
                        IdContrato: datos[0].IdContrato,
                        IdTipoConvertidor: datos[0].IdTipoConvertidor,
                        Convertidor: datos[0].Convertidor,
                        ConsumoRequerido: datos[0].ConsumoRequerido,
                        ConsumoMensual: datos[0].ConsumoMensual,
                        NumeroPeriodos: datos[0].NumeroPeriodos,
                        IdTipoVehiculo: datos[0].IdTipoVehiculo,
                        TipoVehiculo: datos[0].TipoVehiculo
                    });

                    logger.info(JSON.stringify(contratoDat));
                    contrato.push(contratoDat);

                    mensaje = 'Consulta exitosa'
                } else {
                    mensaje = 'No se encontró información'
                }

                resul = {
                    estatus: true,
                    mensaje,
                    contrato
                }

                resolve(resul);

            }).catch((err) => setImmediate(() => {
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al consultar los datos del contrato: ${err}`);
    });
}


/****************************************************************/
/**************    B A S E     D E    D A T O S    **************/
/****************************************************************/
function BdConsultaDatosContrato(IdVehiculo, Usuario) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ Usuario }] METODO: BdConsultaDatosContrato `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        var query_str = `CALL spContratoRegistroConsulta(${IdVehiculo})`;

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
        throw (`Se presentó un error en BdConsultaDatosContrato: ${err}`);
    });

}
/****************************************************************/


module.exports = {
    consultaDatosContrato
};