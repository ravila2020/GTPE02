const DocumentoModel = function(datDocumento) {
    this.Accion = datDocumento.Accion;
    this.IdUsuario = datDocumento.IdUsuario;
    this.IdDocumento = datDocumento.IdDocumento;
    this.Documento = datDocumento.Documento;
    this.IdConcesionario = datDocumento.IdConcesionario;
    this.IdVehiculo = datDocumento.IdVehiculo;
    this.NombreArchivo = datDocumento.NombreArchivo;
    this.Faltante = datDocumento.Faltante;
    this.Estatus = datDocumento.Estatus;
    this.Imagen = datDocumento.Imagen;
    this.Revisado = datDocumento.Revisado;
    this.Correcto = datDocumento.Correcto;
    this.Observaciones = datDocumento.Observaciones;


};



module.exports = { DocumentoModel };