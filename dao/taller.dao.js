const express = require('express');

const app = express();

const logger = require('../log/log');

const { TallerModel } = require('../models/taller.model');

const ruta = ' [taller.dao.js] ';

/* ********** obtieneListaSindicatos ********** */
function consultaTalleresActivos(Estatus, IdUsuario) {

    let etiquetaLOG = ruta + ' FUNCION: consultaTalleresActivos';
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let resul = [];
        let talleres = [];
        let numReg = 0;

        BdConsultaTalleresActivos(Estatus, IdUsuario)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);

                numReg = datos.length;

                if (numReg > 0) {


                    for (var i = 0, l = datos.length; i < l; i++) {

                        let taller = new TallerModel({
                            IdTaller: datos[i].IdTaller,
                            Nombre: datos[i].Nombre,
                            RFC: datos[i].RFC,
                            Concurrencia: datos[i].Concurrencia,
                            DuracionCita: datos[i].DuracionCita,
                            Estatus: datos[i].Estatus,
                            Domicilio: datos[i].Domicilio,
                            IdColonia: datos[i].IdColonia,
                            Colonia: datos[i].Colonia,
                            CP: datos[i].CP,
                            Municipio: datos[i].Municipio,
                            EntidadFederativa: datos[i].EntidadFederativa,
                            Telefono: datos[i].Telefono,
                            Contacto: datos[i].Contacto,
                            HorarioIni: datos[i].HorarioIni,
                            HorarioFin: datos[i].HorarioFin

                        });

                        talleres.push(taller);

                    }
                }
                resul = {
                    estatus: true,
                    mensaje: 'Consulta exitosa',
                    talleres
                }
                resolve(resul);

            }).catch((err) => setImmediate(() => {
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al consultar los Talleres: ${err}`);
    });
}


/****************************************************************/
/**************    B A S E     D E    D A T O S    **************/
/****************************************************************/

function BdConsultaTalleresActivos(Estatus, Usuario) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ Usuario }] METODO: BdConsultaTalleresActivos `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        var query_str = `CALL spConsultaTalleres('${Estatus}')`;

        logger.info(query_str);

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
        throw (`Se presentó un error en BdConsultaTalleresActivos: ${err}`);
    });

}


/****************************************************************/

module.exports = { consultaTalleresActivos };