/*

 Reporte 1 ===> Situación Actual Concesionarios

*/

const Reporte1Model = function(datReporte1) {
    this.IdPersona = datReporte1.IdPersona;
    this.Concesionario = datReporte1.Concesionario;
    this.Marca = datReporte1.Marca;
    this.Submarca = datReporte1.Submarca;
    this.Modelo = datReporte1.Modelo;
    this.VIN = datReporte1.VIN;
    this.Placa = datReporte1.Placa;
    this.Sindicato = datReporte1.Sindicato;
    this.PorcAhorroConcesion = datReporte1.PorcAhorroConcesion;
    this.PorcAhorroPropietario = datReporte1.PorcAhorroPropietario;
    this.PorcAhorroOperador = datReporte1.PorcAhorroOperador;
    this.FechaInicio = datReporte1.FechaInicio;
    this.FechaTermino = datReporte1.FechaTermino;
    this.TotalLitrosConsumir = datReporte1.TotalLitrosConsumir;
    this.TotalLitrosMes = datReporte1.TotalLitrosMes;
    this.LitrosConsumidos = datReporte1.LitrosConsumidos;
    this.LitrosXConsumir = datReporte1.LitrosXConsumir;
    this.ImporteBeneficiosConversion = datReporte1.ImporteBeneficiosConversion;
    this.TotalAhorro = datReporte1.TotalAhorro;
    this.TotalUtilizadoAhorro = datReporte1.TotalUtilizadoAhorro;
    this.TotalAhorroRestante = datReporte1.TotalAhorroRestante;

};

module.exports = { Reporte1Model };