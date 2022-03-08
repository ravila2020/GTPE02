const express = require('express');
const app = express();

app.use(require('./qr'));
app.use(require('./qrs'));
app.use(require('./login'));
app.use(require('./listas'));
app.use(require('./reportes'));
app.use(require('./prerregistro'));
app.use(require('./documentacion'));
app.use(require('./catalogos'));
app.use(require('./citas'));

app.use(require('./registro'));

module.exports = app;
