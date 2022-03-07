const cors = require('cors')
const express = require('express');

require('./config/config');

const app = express();

//Permite todos los request
app.use(cors());
app.options('*', cors());

app.use(express.urlencoded({
    extended: false
}));

app.use(express.json());

app.use(require('./routes/index'));


app.listen(process.env.Port, () => {
    console.log('Escuchando el puerto: ', process.env.Port);
})