const ContratoDatosModel = function(datContrato) {
    this.IdContrato = datContrato.IdContrato;
    this.IdTipoConvertidor = datContrato.IdTipoConvertidor;
    this.Convertidor = datContrato.Convertidor;
    this.ConsumoRequerido = datContrato.ConsumoRequerido;
    this.ConsumoMensual = datContrato.ConsumoMensual;
    this.NumeroPeriodos = datContrato.NumeroPeriodos;
    this.IdTipoVehiculo = datContrato.IdTipoVehiculo;
    this.TipoVehiculo = datContrato.TipoVehiculo;
};

module.exports = { ContratoDatosModel };