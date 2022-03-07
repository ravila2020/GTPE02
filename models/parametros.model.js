const ParametrosModel = function(datParametro) {
    this.IdUsuario = datParametro.IdUsuario;
    this.IdPersona = datParametro.IdPersona;
    this.IdVehiculo = datParametro.IdVehiculo;
    this.TipoConsulta = datParametro.TipoConsulta;
    this.Estatus = datParametro.Estatus;
    this.IdSindicato = datParametro.IdSindicato;
    this.RFC = datParametro.RFC;
    this.TipoPersona = datParametro.TipoPersona;
    this.CP = datParametro.CP;
    this.IdMarca = datParametro.IdMarca;

};


module.exports = { ParametrosModel };