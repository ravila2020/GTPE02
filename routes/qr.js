const express = require('express');
const app = express();

const QRCode = require('qrcode');
const fs = require('fs');

const logger = require('../log/log');

const QrModel = require('../models/qr.model');


const ruta = ' [qr.js] ';

/* ********** Genera código QR ********** */
app.get('/obtenerQR', (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + 'req.usuario.idUsuario' + '] METODO: *** obtenerQR ***';
        logger.info(etiquetaLOG);

        const qrModel = new QrModel({
            vehiculo: req.query.vehiculo || 0,
            concesionario: req.query.concesionario || 0,
            operador: req.query.operador || 0
        });

        let stringData = JSON.stringify(qrModel);
        // console.log(stringData);

        QRCode.toDataURL(stringData, function(err, code) {
            try {
                if (err) {
                    logger.error(`${ruta} ERROR: ${err}`);
                    res.json({
                        ok: false,
                        mensaje: err,
                        codigo: codRespuesta.error
                    });

                } else {
                    // fs.writeFileSync(`${archCodQR}qr.html`, `<img src="${code}">`);

                    res.json({
                        ok: true,
                        mensaje: 'QR generado correctamente',
                        qr: code,
                        codigo: codRespuesta.exito
                    });
                }

            } catch (err) {
                logger.error(`${ruta} ERROR: ${err}`);

                res.json({
                    ok: false,
                    mensaje: detErr + err.message + detErrC,
                    codigo: codRespuesta.error
                });

            }

        });

    } catch (err) {
        logger.error(ruta + 'ERROR: ' + err);
        res.json({
            ok: false,
            mensaje: detErr + err.message + detErrC,
            codigo: codRespuesta.error
        });

    }

});

module.exports = app;