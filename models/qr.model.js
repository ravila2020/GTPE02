const QrModel = function(datQr) {
    this.vehiculo = datQr.vehiculo;
    this.concesionario = datQr.concesionario;
    this.operador = datQr.operador;
};

const QrOperadorModel = function(datQrOp) {
    this.IdOperador = datQrOp.IdOperador;
    this.NombreOperador = datQrOp.NombreOperador;
    this.RFC = datQrOp.RFC;
    this.CURP = datQrOp.CURP;
};

const ConsultaModel = function(datConsulta) {
    this.IdUsuario = datConsulta.IdUsuario;
    this.Placa = datConsulta.Placa;
};

module.exports = { QrModel, QrOperadorModel, ConsultaModel };