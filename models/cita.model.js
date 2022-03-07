const CitaModel = function(datCita) {
    this.IdUsuario = datCita.IdUsuario;
    this.IdCita = datCita.IdCita;
    this.IdConcesionario = datCita.IdConcesionario;
    this.IdVehiculo = datCita.IdVehiculo;
    this.IdTaller = datCita.IdTaller;
    this.Fecha = datCita.Fecha;
    this.IdDictamen = datCita.IdDictamen;
    this.Observaciones = datCita.Observaciones;
    this.Estatus = datCita.Estatus;
    this.FechaDictamen = datCita.FechaDictamen;
};

const CitaIdModel = function(datCita) {
    this.Taller = datCita.Taller;
    this.Domicilio = datCita.Domicilio;
    this.IdColonia = datCita.IdColonia;
    this.Colonia = datCita.Colonia;
    this.CP = datCita.CP;
    this.Municipio = datCita.Municipio;
    this.EntidadFederativa = datCita.EntidadFederativa;
    this.Telefono = datCita.Telefono;
    this.Contacto = datCita.Contacto;
    this.Fecha = datCita.Fecha;
    this.Hora = datCita.Hora;
    this.Estatus = datCita.Estatus;
};

module.exports = { CitaModel, CitaIdModel };