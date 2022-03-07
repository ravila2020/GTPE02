const TallerModel = function(datTaller) {
    this.IdUsuario = datTaller.IdUsuario;
    this.IdTaller = datTaller.IdTaller;
    this.Nombre = datTaller.Nombre;
    this.RFC = datTaller.RFC;
    this.Domicilio = datTaller.Domicilio;
    this.IdColonia = datTaller.IdColonia;
    this.Colonia = datTaller.Colonia;
    this.CP = datTaller.CP;
    this.Municipio = datTaller.Municipio;
    this.EntidadFederativa = datTaller.EntidadFederativa;
    this.Telefono = datTaller.Telefono;
    this.Contacto = datTaller.Contacto;
    this.HorarioIni = datTaller.HorarioIni;
    this.HorarioFin = datTaller.HorarioFin;
    this.Concurrencia = datTaller.Concurrencia;
    this.DuracionCita = datTaller.DuracionCita;
    this.Estatus = datTaller.Estatus;
};

module.exports = { TallerModel };