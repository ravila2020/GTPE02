const express = require('express');
const app = express();

const logger = require('../log/log');
const { UsuarioAccesoModel } = require('../models/usuario.model');

const login = require('../dao/login.dao');

const ruta = ' [login.js] ';

/* ********** login ********** */
app.post('/login', (req, res) => {

    let etiquetaLOG = ruta + ' METODO: Login';
    logger.info(etiquetaLOG);

    let body = req.body;
    let ok = false;
    let mensaje = '';

    const usuarioAccesoModel = new UsuarioAccesoModel({
        IdUsuario: body.Usuario || '',
        Contrasenia: body.Contrasenia || ''
    });

    logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${usuarioAccesoModel.IdUsuario}`);

    login.validarContrasenia(usuarioAccesoModel)
        .then(result => {
            let resultado = JSON.stringify(result);
            let usuarioDat = JSON.parse(resultado);

            ok = usuarioDat.estatus;
            mensaje = usuarioDat.mensaje;

            if (ok) {

                res.json({
                    estatus: true,
                    mensaje,
                    usuario: usuarioDat.usuario,
                    menu: usuarioDat.menu,
                    privilegios: usuarioDat.privilegios,
                    token: usuarioDat.token
                });

            } else {

                logger.info(ruta + 'Atención: ' + mensaje);
                res.json({
                    estatus: false,
                    mensaje
                });
            }
        }, (err) => {

            logger.error(ruta + 'ERROR: ' + err);
            res.json({
                estatus: false,
                mensaje: err
            });

        })

    .catch((err) => {


        logger.error(ruta + 'ERROR: ' + err);
        res.json({
            estatus: false,
            mensaje: err
        });

    });
});

module.exports = app;