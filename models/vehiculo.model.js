const VehiculoModel = function(datVehiculo) {
    this.IdUsuario = datVehiculo.IdUsuario;
    this.IdVehiculo = datVehiculo.IdVehiculo;
    this.IdConcesionario = datVehiculo.IdConcesionario;
    this.IdPropietario = datVehiculo.IdPropietario;
    this.VIN = datVehiculo.VIN;
    this.IdMarca = datVehiculo.IdMarca;
    this.Marca = datVehiculo.Marca;
    this.IdSubmarca = datVehiculo.IdSubmarca;
    this.Submarca = datVehiculo.Submarca;
    this.Modelo = datVehiculo.Modelo;
    this.Placa = datVehiculo.Placa;
    this.Arrendado = datVehiculo.Arrendado;
    this.Estatus = datVehiculo.Estatus;
    this.Color = datVehiculo.Color;
    this.IdRepresentante = datVehiculo.IdRepresentante;
    this.FechaAlta = datVehiculo.FechaAlta;
};

module.exports = { VehiculoModel };