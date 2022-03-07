const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const logger = require('../log/log');

const { UsuarioModel, UsuarioTokenModel } = require('../models/usuario.model');

const ruta = ' [login.dao.js] ';

/* ********** validarContrasenia -- Indica si es valida la contraseña para login o cambio de contraseña ********** */
function validarContrasenia(entrada) {
    let etiquetaLOG = ruta + ' METODO: validarContrasenia';
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        let token;
        let ok = false;
        let mensaje = '';
        let resul = [];

        let numMenu = 0;
        let resultadoDatMenu;
        let opciones = [];

        let numPrivilegios = 0;
        let idPaginaCompara = 0;
        let resultadoDatPrivilegios;
        let listaPaginas = [];
        let listaAccion = [];
        let sPagina = 0;
        let sUrl = '';

        let nombre = '';
        let icono = '';
        let ruta = '';

        let menuGrupo = null;

        let listaMenu = [];
        let listaSubmenu = [];
        let listaSub2menu = [];
        let listaSub3menu = [];

        BdObtenerUsuario(entrada.IdUsuario)
            .then(function(rows) {

                let resultado = JSON.stringify(rows[0]);
                let datos = JSON.parse(resultado);

                ok = datos.resultado;
                mensaje = datos.mensaje;

                if (ok) {

                    const respuesta = new UsuarioModel({
                        IdUsuario: datos.IdUsuario,
                        Nombre: datos.Nombre,
                        IdPerfil: datos.IdPerfil,
                        Perfil: datos.Perfil,
                        IdEmpleado: datos.IdEmpleado
                    });

                    const respuestaToken = new UsuarioTokenModel({
                        IdUsuario: datos.IdUsuario,
                        Nombre: datos.Nombre,
                        IdPerfil: datos.IdPerfil,
                        Perfil: datos.Perfil,
                        IdEmpleado: datos.IdEmpleado
                    });

                    //Se obtiene el token
                    token = jwt.sign({
                        usuario: respuestaToken
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                    //Se obtiene contraseña -- para actualizar el dato en la BD
                    bcrypt.hash(entrada.Contrasenia, saltRounds).then(function(hash) {
                        logger.info('hash------------------------------->');
                        logger.info(hash);
                    });

                    //Se valida la contraseña
                    comparaContraseña(entrada.Contrasenia, datos.Contrasenia)
                        .then(function(continuar) {

                            if (continuar) {
                                //Se obtiene el menú
                                BdObtenerMenu(datos.IdPerfil, entrada.IdUsuario)
                                    .then(function(result) {

                                        numMenu = result.length;
                                        resultadoDatMenu = result;

                                        logger.info(`${etiquetaLOG} RESPUESTA: estatus = ${(numMenu>0)?true:false}, mensaje = ${(numMenu>0)?'Consulta exitosa':'No se encontró información de Menú con el Perfil indicado'}, codigo =  ${(numMenu>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                                        if (numMenu > 0) {

                                            for (var i = 0, l = numMenu; i < l; i++) {

                                                if (resultadoDatMenu[i].IdMenuGrupo == null) {

                                                    menuGrupo = resultadoDatMenu[i].IdMenu;

                                                    idMenu = resultadoDatMenu[i].IdMenu;
                                                    nombre = resultadoDatMenu[i].Nombre;
                                                    icono = resultadoDatMenu[i].Icono;
                                                    ruta = resultadoDatMenu[i].Ruta;

                                                    for (var j = 0, m = numMenu; j < m; j++) {

                                                        if (menuGrupo == resultadoDatMenu[j].IdMenuGrupo) {

                                                            // Se verifican los sub sub sub... menus
                                                            let existenHijos = resultadoDatMenu.find(element => element.IdMenuGrupo == resultadoDatMenu[j].IdMenu);
                                                            if (existenHijos != undefined) {

                                                                //logger.info('existenHijos====================>>>>>>>>>>>>>>>>>>>');
                                                                //logger.info(JSON.stringify(existenHijos));

                                                                for (var k = 0, n = numMenu; k < n; k++) {

                                                                    if (resultadoDatMenu[j].IdMenu == resultadoDatMenu[k].IdMenuGrupo) {

                                                                        //********************************************************* */
                                                                        // Se verifican los sub sub sub... menus
                                                                        let existenHijos = resultadoDatMenu.find(element => element.IdMenuGrupo == resultadoDatMenu[k].IdMenu);
                                                                        if (existenHijos != undefined) {

                                                                            for (var w = 0, x = numMenu; w < x; w++) {

                                                                                if (resultadoDatMenu[k].IdMenu == resultadoDatMenu[w].IdMenuGrupo) {

                                                                                    var sub3Menu = {
                                                                                        displayName: resultadoDatMenu[w].Nombre,
                                                                                        iconName: resultadoDatMenu[w].Icono,
                                                                                        route: resultadoDatMenu[w].Ruta,
                                                                                    };

                                                                                    listaSub3menu.push(sub3Menu);
                                                                                }
                                                                            }

                                                                        }

                                                                        if (listaSub3menu.length > 0) {
                                                                            var subMenu = {
                                                                                displayName: resultadoDatMenu[k].Nombre,
                                                                                iconName: resultadoDatMenu[k].Icono,
                                                                                route: resultadoDatMenu[k].Ruta,
                                                                                children: listaSub3menu
                                                                            };


                                                                            listaSub2menu.push(subMenu);

                                                                        } else {
                                                                            var subMenu = {
                                                                                displayName: resultadoDatMenu[k].Nombre,
                                                                                iconName: resultadoDatMenu[k].Icono,
                                                                                route: resultadoDatMenu[k].Ruta,
                                                                            };


                                                                            listaSub2menu.push(subMenu);
                                                                        }
                                                                        listaSub3menu = [];
                                                                    }
                                                                }

                                                            }

                                                            if (listaSub2menu.length > 0) {
                                                                var subMenu = {
                                                                    displayName: resultadoDatMenu[j].Nombre,
                                                                    iconName: resultadoDatMenu[j].Icono,
                                                                    route: resultadoDatMenu[j].Ruta,
                                                                    children: listaSub2menu
                                                                };

                                                                listaSubmenu.push(subMenu);

                                                            } else {
                                                                var subMenu = {
                                                                    displayName: resultadoDatMenu[j].Nombre,
                                                                    iconName: resultadoDatMenu[j].Icono,
                                                                    route: resultadoDatMenu[j].Ruta,
                                                                };

                                                                listaSubmenu.push(subMenu);
                                                            }
                                                            listaSub2menu = [];
                                                        }
                                                    }
                                                    var menu = {
                                                        displayName: nombre,
                                                        iconName: icono,
                                                        route: ruta,
                                                        children: listaSubmenu
                                                    };

                                                    listaMenu.push(menu);
                                                    listaSubmenu = [];

                                                }

                                            }

                                            opciones.push(listaMenu);

                                            //Se obtienen los privilegios ******************************************************************
                                            BdObtenerPrivilegios(datos.IdPerfil, entrada.IdUsuario)
                                                .then(function(result) {

                                                    numPrivilegios = result.length;
                                                    resultadoDatPrivilegios = result;

                                                    logger.info(`${etiquetaLOG} RESPUESTA: estatus = ${(numMenu>0)?true:false}, mensaje = ${(numMenu>0)?'Consulta exitosa':'No se encontró información de Privilegios con el Perfil indicado'}, codigo =  ${(numMenu>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                                                    if (numPrivilegios > 0) {
                                                        for (var i = 0, l = numPrivilegios; i < l; i++) {

                                                            if (idPaginaCompara == resultadoDatPrivilegios[i].IdPagina) {

                                                                var Detalle = {
                                                                    idAccion: resultadoDatPrivilegios[i].IdAccion,
                                                                    accion: resultadoDatPrivilegios[i].Accion
                                                                }

                                                                listaAccion.push(Detalle);

                                                            } else {

                                                                if (i > 0) {

                                                                    var Pag = {
                                                                        pagina: sPagina,
                                                                        url: sUrl,
                                                                        privilegios: listaAccion
                                                                    }

                                                                    listaPaginas.push(Pag);
                                                                    listaAccion = [];
                                                                }

                                                                idPaginaCompara = resultadoDatPrivilegios[i].IdPagina;
                                                                sPagina = resultadoDatPrivilegios[i].Pagina;
                                                                sUrl = resultadoDatPrivilegios[i].Url;

                                                                var Detalle = {
                                                                    idAccion: resultadoDatPrivilegios[i].IdAccion,
                                                                    accion: resultadoDatPrivilegios[i].Accion
                                                                }

                                                                listaAccion.push(Detalle);

                                                            }

                                                        }

                                                        var Pag = {
                                                            pagina: sPagina,
                                                            url: sUrl,
                                                            privilegios: listaAccion
                                                        }

                                                        listaPaginas.push(Pag);

                                                        resul = {
                                                            estatus: ok,
                                                            mensaje,
                                                            usuario: respuesta,
                                                            menu: opciones,
                                                            privilegios: listaPaginas,
                                                            token
                                                        }

                                                        resolve(resul);

                                                    } else {

                                                        resul = {
                                                            estatus: ok,
                                                            mensaje,
                                                            usuario: respuesta,
                                                            menu: opciones,
                                                            privilegios: listaAccion,
                                                            token
                                                        }

                                                        resolve(resul);

                                                    }

                                                }).catch((err) => setImmediate(() => {
                                                    logger.info(err);

                                                    return reject(err);
                                                }));

                                        } else {

                                            resul = {
                                                estatus: ok,
                                                mensaje,
                                                usuario: respuesta,
                                                menu: opciones,
                                                token
                                            }

                                            resolve(resul);

                                        }

                                    }).catch((err) => setImmediate(() => {
                                        logger.info(err);

                                        return reject(err);
                                    }));

                            } else {
                                resul = {
                                    estatus: false,
                                    mensaje: 'Verifique la contraseña',
                                    usuario: [],
                                    token
                                }
                                resolve(resul);
                            }

                        }).catch((err) => setImmediate(() => {
                            return reject(err);
                        }));

                } else {
                    resul = {
                        estatus: datos.resultado,
                        mensaje: datos.mensaje,
                        usuario: [],
                        token
                    }

                    resolve(resul);

                }

            }).catch((err) => setImmediate(() => {
                return reject(err);
            }));

    })

    .catch((err) => {
        logger.error(err);
        throw (`Se presentó un error en validarContrasenia: ${err}`);
    });
}


function comparaContraseña(acceso, bd) {

    return new Promise(function(resolve, reject) {

        if (bcrypt.compareSync(acceso, bd)) {
            return resolve(true);
        } else {
            return resolve(false);
        }
    })

    .catch((err) => {
        throw (`Se presentó un error en comparaContraseña: ${err}`);
    });

}

function obtenerHijos(valor, arreglo) {

    return new Promise(function(resolve, reject) {

        if (bcrypt.compareSync(acceso, bd)) {
            return resolve(true);
        } else {
            return resolve(false);
        }
    })

    .catch((err) => {
        throw (`Se presentó un error al generar el menú: ${err}`);
    });

}

/****************************************************************/
/**************    B A S E     D E    D A T O S    **************/
/****************************************************************/

function BdObtenerUsuario(Usuario) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ Usuario }] METODO: BdObtenerUsuario `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        var query_str = `CALL spConsultaUsuarioAcceso('${Usuario}')`;

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
        throw (`Se presentó un error en BdObtenerUsuario: ${err}`);
    });

}


function BdObtenerMenu(Perfil, Usuario) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ Usuario }] METODO: BdObtenerMenu `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        var query_str = `CALL spConsultaMenu(${Perfil})`;
        logger.info('query_str====================================>');
        logger.info(query_str);

        con.query(query_str, function(err, rows, fields) {

            if (err) {
                logger.info('err BdObtenerMenu');
                logger.info(err);
                if (err.message != 'connect ETIMEDOUT')
                    con.end();

                return reject(err);
            }

            con.end();
            resolve(rows[0]);
        });
    })

    .catch((err) => {

        logger.info('err BdObtenerMenu CHATCH');
        logger.info(err);

        throw (`Se presentó un error en BdObtenerMenu: ${err}`);
    });

}

function BdObtenerPrivilegios(Perfil, Usuario) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ Usuario }] METODO: BdObtenerPrivilegios `;
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {

        const mysql = require('mysql2');

        const con = mysql.createConnection(configBD);

        var query_str = `CALL spConsultaPrivilegiosPagina(${Perfil})`;
        logger.info('query_str====================================>');
        logger.info(query_str);

        con.query(query_str, function(err, rows, fields) {

            if (err) {
                logger.info('err BdObtenerPrivilegios');
                logger.info(err);
                if (err.message != 'connect ETIMEDOUT')
                    con.end();

                return reject(err);
            }

            con.end();
            resolve(rows[0]);
        });
    })

    .catch((err) => {

        logger.info('err BdObtenerPrivilegios catch');
        logger.info(err);

        throw (`Se presentó un error en BdObtenerPrivilegios: ${err}`);
    });

}

module.exports = { validarContrasenia }