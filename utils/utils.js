const logger = require('../log/log');

const ruta = ' [utils.js] ';


function paramSP(pDato, pTipo) {

    try {

        if (pDato == '' || pDato == 0 || pDato == undefined) {
            return 'NULL';

        } else {
            if (pTipo == 'S')
                return `'${pDato}'`;
            else
                return `${pDato}`;
        }
    } catch (err) {
        logger.info(` ${ruta} paramSP --> ENTRADA -->  ${pDato}, ${pTipo} ERROR: ${ err } `);
        throw err;
    }
}



module.exports = {
    paramSP
}