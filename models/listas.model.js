const SindicatosModel = function(datSindicato) {
    this.IdSindicato = datSindicato.IdSindicato;
    this.Nombre = datSindicato.Nombre;
    this.Seccion = datSindicato.Seccion;
    this.Responsable = datSindicato.Responsable;
    this.Direccion = datSindicato.Direccion;
    this.Region = datSindicato.Region;
    this.Estatus = datSindicato.Estatus;

};

const AsignacionSindicatoModel = function(datAsignacion) {
    this.IdAsignacionSindicato = datAsignacion.IdAsignacionSindicato;
    this.AsignacionSindicato = datAsignacion.AsignacionSindicato;

};

const AsentamientoModel = function(datAsentamiento) {
    this.CP = datAsentamiento.CP;
    this.IdColonia = datAsentamiento.IdColonia;
    this.Colonia = datAsentamiento.Colonia;
    this.Municipio = datAsentamiento.Municipio;
    this.EntidadFederativa = datAsentamiento.EntidadFederativa;

};

const IdentificacionModel = function(datIdentifica) {
    this.IdIdentificacion = datIdentifica.IdIdentificacion;
    this.Nombre = datIdentifica.Nombre;
    this.Emisor = datIdentifica.Emisor;
};

const DictamenModel = function(datDictamen) {
    this.IdDictamen = datDictamen.IdDictamen;
    this.Nombre = datDictamen.Nombre;

};

const MarcasModel = function(datMarca) {
    this.IdMarca = datMarca.IdMarca;
    this.Nombre = datMarca.Nombre;
};

const SubmarcasModel = function(datSubmarca) {
    this.IdSubmarca = datSubmarca.IdSubmarca;
    this.Nombre = datSubmarca.Nombre;
};

module.exports = {
    SindicatosModel,
    AsignacionSindicatoModel,
    AsentamientoModel,
    IdentificacionModel,
    DictamenModel,
    MarcasModel,
    SubmarcasModel
};