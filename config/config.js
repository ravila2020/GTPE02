// ========== Puerto ========== //
process.env.PORT = process.env.PORT || 4042
    // ========== Conexión a Datos ========== //
configBD = {
    host: '192.168.1.31',
    user: 'root',
    password: 'root2021',
    database: 'gtpe02',
    port: 3306
};

// ========== Tiempo expiración token ========== //
process.env.CADUCIDAD_TOKEN = 8 * 60 * 60 * 1000;

// ========== SEED para encriptar contraseña ========== //
process.env.SEED = '53m1ll4T0k3n';

// ========== Códigos de respuesta de los servicios solicitados ========== //
codRespuesta = {
    exito: 'AV200',
    noDatos: 'AV201',
    error: 'AV400'
};

// ========== Leyenda para mostrar el error hacia el usuario ========== //
detErr = 'Ocurrió un error (';
detErrC = ')';

// ========== Rutas ========== //
archCodQR = 'C:/ArchivosQR/';
logDir = './logFiles';
documentos = 'C:/ArchivosDocumentos/'

// ========== Veces para encriptación ========== //
saltRounds = 10;