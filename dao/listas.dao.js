const express = require('express');

const app = express();

const logger = require('../log/log');

const {
    SindicatosModel,
    AsignacionSindicatoModel,
    AsentamientoModel,
    IdentificacionModel,
    DictamenModel,
    MarcasModel,
    SubmarcasModel
} = require('../models/listas.model');

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
                            let sindicato = new SindicatosModel({
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
                        estatus: true,
                        mensaje: 'No se encontró información',
                        sindicatos: []
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

/* ********** obtieneAsignacionSindicato ********** */
function obtieneAsignacionSindicato(entrada) {

    let etiquetaLOG = ruta + ' FUNCION: obtieneAsignacionSindicato';
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let resul = [];
        let asignacion = [];
        let numReg = 0;

        BdConsultaAsignacionSindicato(entrada.IdSindicato, entrada.IdUsuario)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);

                numReg = datos.length;

                if (numReg > 0) {

                    for (var i = 0, l = datos.length; i < l; i++) {

                        let asigna = new AsignacionSindicatoModel({
                            IdAsignacionSindicato: datos[i].IdAsignacionSindicato,
                            AsignacionSindicato: datos[i].AsignacionSindicato
                        });

                        asignacion.push(asigna);

                    }

                    resul = {
                        estatus: true,
                        mensaje: 'Consulta exitosa',
                        asignacion
                    }

                } else {

                    resul = {
                        estatus: true,
                        mensaje: 'No se encontró información',
                        asignacion: []
                    }

                }

                resolve(resul);

            }).catch((err) => setImmediate(() => {
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al obtener las asignaciones de sindicato: ${err}`);
    });
}

/* ********** obtieneAsentamientos ********** */
function obtieneAsentamientos(entrada) {

    let etiquetaLOG = ruta + ' FUNCION: obtieneAsentamientos';
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let resul = [];
        let asentamientos = [];
        let numReg = 0;

        BdObtieneAsentamientos(entrada.CP, entrada.IdUsuario)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);

                numReg = datos.length;

                if (numReg > 0) {

                    for (var i = 0, l = datos.length; i < l; i++) {

                        let asentamiento = new AsentamientoModel({

                            IdColonia: datos[i].IdColonia,
                            Colonia: datos[i].Colonia

                        });

                        asentamientos.push(asentamiento);

                    }
                    let datosCP = {
                        Municipio: datos[0].Municipio,
                        EntidadFederativa: datos[0].EntidadFederativa,
                        asentamientos
                    }

                    resul = {
                        estatus: true,
                        mensaje: 'Consulta exitosa',
                        asentamientos: datosCP
                    }

                } else {

                    resul = {
                        estatus: true,
                        mensaje: 'No se encontró información',
                        asentamientos: []
                    }

                }

                resolve(resul);

            }).catch((err) => setImmediate(() => {
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al obtener los asentamientos: ${err}`);
    });
}
/* ********** obtieneIdentificaciones ********** */
function obtieneIdentificaciones(IdUsuario) {

    let etiquetaLOG = ruta + ' FUNCION: obtieneIdentificaciones';
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let resul = [];
        let identificaciones = [];
        let numReg = 0;

        BdConsultaIdentificaciones(IdUsuario)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);

                numReg = datos.length;

                if (numReg > 0) {

                    for (var i = 0, l = datos.length; i < l; i++) {

                        let identifica = new IdentificacionModel({
                            IdIdentificacion: datos[i].IdIdentificacion,
                            Nombre: datos[i].Nombre,
                            Emisor: datos[i].Emisor
                        });

                        identificaciones.push(identifica);

                    }

                    resul = {
                        estatus: true,
                        mensaje: 'Consulta exitosa',
                        identificaciones
                    }

                } else {

                    resul = {
                        estatus: true,
                        mensaje: 'No se encontró información',
                        identificaciones: []
                    }

                }

                resolve(resul);

            }).catch((err) => setImmediate(() => {
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al obtener las identificaciones: ${err}`);
    });
}

/* ********** obtieneDictamen ********** */
function obtieneDictamen(IdUsuario) {

    let etiquetaLOG = ruta + ' FUNCION: obtieneDictamen';
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let resul = [];
        let dictamenes = [];
        let numReg = 0;

        BdConsultaDictamenes(IdUsuario)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);

                numReg = datos.length;

                if (numReg > 0) {

                    for (var i = 0, l = datos.length; i < l; i++) {

                        let dictamen = new DictamenModel({
                            IdDictamen: datos[i].IdDictamen,
                            Nombre: datos[i].Nombre
                        });

                        dictamenes.push(dictamen);

                    }

                    resul = {
                        estatus: true,
                        mensaje: 'Consulta exitosa',
                        dictamenes
                    }

                } else {

                    resul = {
                        estatus: true,
                        mensaje: 'No se encontró información',
                        dictamenes: []
                    }

                }

                resolve(resul);

            }).catch((err) => setImmediate(() => {
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al obtener la lista de dictamenes: ${err}`);
    });
}


/* ********** obtieneMarcas ********** */
function obtieneMarcas(IdUsuario) {

    let etiquetaLOG = ruta + ' FUNCION: obtieneMarcas';
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let resul = [];
        let marcas = [];
        let numReg = 0;

        BdObtieneMarcas(IdUsuario)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);

                numReg = datos.length;

                if (numReg > 0) {

                    for (var i = 0, l = datos.length; i < l; i++) {

                        let marca = new MarcasModel({

                            IdMarca: datos[i].IdMarca,
                            Nombre: datos[i].Nombre

                        });

                        marcas.push(marca);

                    }

                    resul = {
                        estatus: true,
                        mensaje: 'Consulta exitosa',
                        marcas
                    }

                } else {

                    resul = {
                        estatus: true,
                        mensaje: 'No se encontró información',
                        marcas: []
                    }

                }

                resolve(resul);

            }).catch((err) => setImmediate(() => {
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al obtener las marcas de vehículos: ${err}`);
    });
}
/* ********** obtieneSubarcas ********** */
function obtieneSubmarcas(entrada) {

    let etiquetaLOG = ruta + ' FUNCION: obtieneSubmarcas';
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let resul = [];
        let submarcas = [];
        let numReg = 0;

        BdObtieneSubmarcas(entrada.IdMarca, entrada.IdUsuario)
            .then(function(rows) {

                let resultado = JSON.stringify(rows);
                let datos = JSON.parse(resultado);

                numReg = datos.length;

                if (numReg > 0) {

                    for (var i = 0, l = datos.length; i < l; i++) {

                        let submarca = new SubmarcasModel({

                            IdSubmarca: datos[i].IdSubmarca,
                            Nombre: datos[i].Nombre

                        });

                        submarcas.push(submarca);

                    }

                    resul = {
                        estatus: true,
                        mensaje: 'Consulta exitosa',
                        submarcas
                    }

                } else {

                    resul = {
                        estatus: true,
                        mensaje: 'No se encontró información',
                        submarcas: []
                    }

                }

                resolve(resul);

            }).catch((err) => setImmediate(() => {
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error al obtener las submarcas de vehículos: ${err}`);
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

        logger.info('query_str');
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
        throw (`Se presentó un error en BdConsultaSindicatos: ${err}`);
    });

}

function BdConsultaAsignacionSindicato(IdSindicato, Usuario) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ Usuario }] METODO: BdConsultaAsignacionSindicato `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        var query_str = `CALL spConsultaAsignacionSindicato('${IdSindicato}')`;

        logger.info('query_str');
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
        throw (`Se presentó un error en BdConsultaAsignacionSindicato: ${err}`);
    });

}

function BdObtieneAsentamientos(CP, Usuario) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ Usuario }] METODO: BdObtieneAsentamientos `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        var query_str = `CALL spConsultaCP('${CP}')`;

        logger.info('query_str');
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
        throw (`Se presentó un error en BdObtieneAsentamientos: ${err}`);
    });

}

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
                            let sindicato = new SindicatosModel({
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
                        estatus: true,
                        mensaje: 'No se encontró información',
                        sindicatos: []
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

function BdConsultaIdentificaciones(Usuario) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ Usuario }] METODO: BdConsultaIdentificaciones `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        var query_str = `CALL spConsultaIdentificaciones()`;

        logger.info('query_str');
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
        throw (`Se presentó un error en BdConsultaIdentificaciones: ${err}`);
    });

}

function BdConsultaDictamenes(Usuario) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ Usuario }] METODO: BdConsultaDictamenes `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        var query_str = `CALL spConsultaDictamenes()`;

        logger.info('query_str');
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
        throw (`Se presentó un error en BdConsultaDictamenes: ${err}`);
    });

}

function BdObtieneMarcas(CP, Usuario) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ Usuario }] METODO: BdObtieneMarcas `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        var query_str = `CALL spConsultaMarcas()`;

        logger.info('query_str');
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
        throw (`Se presentó un error en BdObtieneMarcas: ${err}`);
    });

}

function BdObtieneSubmarcas(IdMarca, Usuario) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ Usuario }] METODO: BdObtieneSubmarcas `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        var query_str = `CALL spConsultaSubMarcas(${IdMarca})`;

        logger.info('query_str');
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
        throw (`Se presentó un error en BdObtieneSubmarcas: ${err}`);
    });

}

/****************************************************************/

module.exports = {
    obtieneSindicatos,
    obtieneAsignacionSindicato,
    obtieneAsentamientos,
    obtieneIdentificaciones,
    obtieneDictamen,
    obtieneMarcas,
    obtieneSubmarcas
};