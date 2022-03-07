const UsuarioAccesoModel = function(datUsuario) {
    this.IdUsuario = datUsuario.IdUsuario;
    this.Contrasenia = datUsuario.Contrasenia;
};

const UsuarioModel = function(datUsuario) {
    this.IdUsuario = datUsuario.IdUsuario;
    this.Nombre = datUsuario.Nombre;
    this.Contrasenia = datUsuario.Contrasenia;
    this.IdPerfil = datUsuario.IdPerfil;
    this.Perfil = datUsuario.Perfil;
    this.IdEmpleado = datUsuario.IdEmpleado;
};

const UsuarioTokenModel = function(datUsuario) {
    this.IdUsuario = datUsuario.IdUsuario;
    this.Nombre = datUsuario.Nombre;
    this.IdPerfil = datUsuario.IdPerfil;
    this.Perfil = datUsuario.Perfil;
};

module.exports = { UsuarioAccesoModel, UsuarioModel, UsuarioTokenModel };