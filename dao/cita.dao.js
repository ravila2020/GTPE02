const express = require('express');
const Logger = require('nodemon/lib/utils/log');

const logger = require('../log/log');

const { CitaModel, CitaIdModel } = require('../models/cita.model');

const utils = require('../utils/utils');

const ruta = ' [cita.dao.js] ';


/* ********** Consulta las Disponibilidad    ********** */
function consultaTallerDisponibilidad(entrada) {
    let etiquetaLOG = ruta + ' FUNCION: consultaTallerDisponibilidad';
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let resul = [];
        let fechasDisp = [];
        let numReg = 0;

        BDConsultaTallerDisponibilidad(entrada.IdTaller, entrada.Fecha, entrada.IdUsuario)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);

                numReg = datos.length;

                if (numReg > 0) {

                    for (var i = 0, l = datos.length - 1; i < l; i++) {
                        let fechas = JSON.stringify(datos[i]);
                        let fechaX = JSON.parse(fechas);
                        let datoFecha = fechaX[0];

                        let fecha = {
                            Fecha: datoFecha.Fecha,
                            Disponibles: datoFecha.Disponibles,
                            Color: datoFecha.Color
                        };

                        fechasDisp.push(fecha);
                    }
                }

                resul = {
                    estatus: true,
                    mensaje: 'Consulta exitosa',
                    fechasDisp
                }

                resolve(resul);

            }).catch((err) => setImmediate(() => {
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al consultar la disponibilidad del Taller: ${err}`);
    });
}

/* ********** Consulta Horas Disponibles    ********** */
function consultaHorasDisponibles(entrada) {
    let etiquetaLOG = ruta + ' FUNCION: consultaHorasDisponibles';
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let resul = [];
        let HorasDisp = [];
        let numReg = 0;

        BDConsultaHorasDisponibles(entrada.IdTaller, entrada.Fecha, entrada.IdUsuario)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);

                numReg = datos.length;

                if (numReg > 0) {

                    for (var i = 0, l = datos.length - 1; i < l; i++) {
                        let horas = JSON.stringify(datos[i]);
                        let horaX = JSON.parse(horas);
                        let datoHora = horaX[0];

                        let horaC = {
                            Hora: datoHora.HoraCita
                        };

                        HorasDisp.push(horaC);
                    }
                }

                resul = {
                    estatus: true,
                    mensaje: 'Consulta exitosa',
                    HorasDisp
                }

                resolve(resul);

            }).catch((err) => setImmediate(() => {
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al consultar las horas disponibles: ${err}`);
    });
}


/* ********** Consulta las Citas    ********** */
function consultaCita(entrada) {
    let etiquetaLOG = ruta + ' FUNCION: consultaCita';
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let resul = [];
        let citas = [];
        let numReg = 0;

        BdConsultaCita(entrada.IdVehiculo, entrada.Fecha, entrada.IdUsuario)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);

                numReg = datos.length;

                if (numReg > 0) {

                    for (var i = 0, l = datos.length; i < l; i++) {
                        let cita = new CitaModel({
                            IdCita: datos[i].IdCita,
                            IdVehiculo: datos[i].IdVehiculo,
                            Fecha: datos[i].Fecha,
                            IdDictamen: datos[i].IdDictamen,
                            Observaciones: datos[i].Observaciones,
                            Estatus: datos[i].Estatus,
                            FechaDictamen: datos[i].FechaDictamen
                        });

                        citas.push(cita);
                    }
                }

                resul = {
                    estatus: true,
                    mensaje: 'Consulta exitosa',
                    citas
                }

                resolve(resul);

            }).catch((err) => setImmediate(() => {
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al consultar las citas: ${err}`);
    });
}

/* ********** Edita un Vehiculo   ********** */
function registraCita(Entrada) {

    let etiquetaLOG = `${ ruta }[Usuario: ${Entrada.IdUsuario}] METODO: registraCita `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let ok = false;
        let mensaje = '';
        let mensajeDet = '';
        let IdCita = 0;

        BdCita('R', Entrada)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);

                ok = datos[0].resultado;
                mensaje = datos[0].mensaje;
                mensajeDet = datos[0].mensajeDet;
                IdCita = datos[0].IdCita;
                resul = {
                    estatus: ok,
                    mensaje,
                    mensajeDet,
                    IdCita
                }

                resolve(resul);

            }).catch((err) => setImmediate(() => {
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al registrar la Cita: ${err}`);
    });
}

function cancelaCita(Entrada) {

    let etiquetaLOG = `${ ruta }[Usuario: ${Entrada.IdUsuario}] METODO: cancelaCita `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let ok = false;
        let mensaje = '';
        let mensajeDet = '';
        let IdCita = 0;

        BdCita('C', Entrada)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);

                ok = datos[0].resultado;
                mensaje = datos[0].mensaje;
                mensajeDet = datos[0].mensajeDet;
                IdCita = datos[0].IdCita;

                resul = {
                    estatus: ok,
                    mensaje,
                    mensajeDet,
                    IdCita
                }

                resolve(resul);

            }).catch((err) => setImmediate(() => {
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al cancelar la Cita: ${err}`);
    });
}

function dictaminaCita(Entrada) {

    let etiquetaLOG = `${ ruta }[Usuario: ${Entrada.IdUsuario}] METODO: dictaminaCita `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let ok = false;
        let mensaje = '';
        let mensajeDet = '';
        let IdCita = 0;

        BdCita('D', Entrada)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);

                ok = datos[0].resultado;
                mensaje = datos[0].mensaje;
                mensajeDet = datos[0].mensajeDet;
                IdCita = datos[0].IdCita;

                resul = {
                    estatus: ok,
                    mensaje,
                    mensajeDet,
                    IdCita
                }

                resolve(resul);

            }).catch((err) => setImmediate(() => {
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al dictaminar la Cita: ${err}`);
    });
}


/* ********** Consulta las Citas    ********** */
function consultaCitaId(entrada) {
    let etiquetaLOG = ruta + ' FUNCION: consultaCitaId';
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let resul = [];
        let cita = [];
        let numReg = 0;

        BdConsultaCitaId(entrada.IdCita, entrada.IdUsuario)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);

                numReg = datos.length;

                if (numReg > 0) {

                    let citaId = new CitaIdModel({
                        Taller: datos[0].Taller,
                        Domicilio: datos[0].Domicilio,
                        IdColonia: datos[0].IdColonia,
                        Colonia: datos[0].Colonia,
                        CP: datos[0].CP,
                        Municipio: datos[0].Municipio,
                        EntidadFederativa: datos[0].EntidadFederativa,
                        Telefono: datos[0].Telefono,
                        Contacto: datos[0].Contacto,
                        Fecha: datos[0].Fecha,
                        Hora: datos[0].Hora,
                        Estatus: datos[0].Estatus
                    });

                    cita.push(citaId);

                }

                resul = {
                    estatus: true,
                    mensaje: 'Consulta exitosa',
                    cita
                }

                resolve(resul);

            }).catch((err) => setImmediate(() => {
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al consultar la cita: ${err}`);
    });
}

/****************************************************************/
/**************    B A S E     D E    D A T O S    **************/
/****************************************************************/
function BdConsultaCita(IdVehiculo, Fecha, Usuario) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ Usuario }] METODO: BdConsultaCita `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        var query_str = `CALL spConsultaCitas(${IdVehiculo},'${Fecha}')`;

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
        throw (`Se presentó un error en BdConsultaCita: ${err}`);
    });

}
/****************************************************************/
function BDConsultaTallerDisponibilidad(IdTaller, Fecha, Usuario) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ Usuario }] METODO: BDConsultaTallerDisponibilidad `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        var query_str = `CALL spFechasDispTaller(${IdTaller},'${Fecha}')`;

        logger.info(query_str);

        con.query(query_str, function(err, rows) {

            if (err) {
                if (err.message != 'connect ETIMEDOUT')
                    con.end();

                return reject(err);
            }

            con.end();

            resolve(rows);
        });
    })

    .catch((err) => {
        throw (`Se presentó un error en BDConsultaTallerDisponibilidad: ${err}`);
    });

}

/****************************************************************/

function BDConsultaHorasDisponibles(IdTaller, Fecha, Usuario) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ Usuario }] METODO: BDConsultaHorasDisponibles `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        var query_str = `CALL spHorasDispTaller(${IdTaller}, '${Fecha}')`;
        logger.info(query_str);

        con.query(query_str, function(err, rows) {

            if (err) {
                if (err.message != 'connect ETIMEDOUT')
                    con.end();

                return reject(err);
            }

            con.end();

            resolve(rows);
        });
    })

    .catch((err) => {
        throw (`Se presentó un error en BDConsultaHorasDisponibles: ${err}`);
    });

}

/****************************************************************/
function BdCita(Accion, Entrada) {

    let etiquetaLOG = `${ ruta }[Usuario: ${Entrada.IdUsuario }] METODO: BdCita `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let query_str = '';

        query_str = `CALL spCita( '${Accion}',
        ${utils.paramSP(Entrada.IdCita,'N')},  
        ${utils.paramSP(Entrada.IdVehiculo,'N')},  
        ${utils.paramSP(Entrada.Fecha,'S')},
        ${utils.paramSP(Entrada.IdTaller,'N')}, 
        ${utils.paramSP(Entrada.IdDictamen,'S')},
        ${utils.paramSP(Entrada.Observaciones,'S')},
        ${utils.paramSP(Entrada.IdConcesionario,'N')}
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
        throw (`Se presentó un error en BdCita: ${err}`);
    });

}
/****************************************************************/
function BdConsultaCitaId(IdCita, Usuario) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ Usuario }] METODO: BdConsultaCita `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        var query_str = `CALL spConsultaCitaId(${IdCita})`;

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
        throw (`Se presentó un error en BdConsultaCitaId: ${err}`);
    });

}

/****************************************************************/

module.exports = {
    registraCita,
    consultaCita,
    cancelaCita,
    dictaminaCita,
    consultaTallerDisponibilidad,
    consultaHorasDisponibles,
    consultaCitaId
};