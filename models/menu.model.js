const MenuModel = function(datMenu) {
    this.IdMenu = datMenu.IdMenu;
    this.Nombre = datMenu.Nombre;
    this.Icono = datMenu.Icono;
    this.Ruta = datMenu.Ruta;
    this.IdMenuGrupo = datMenu.IdMenuGrupo;
};

module.exports = { MenuModel };