var express     = require('express');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var port        = process.env.PORT || 8080;

//Express
//Definir aplicación
var app = express();

//Utilizar carpeta estática "www"
app.use(express.static(__dirname + '/www'));

// BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Log hacia consola
app.use(morgan('dev'));

//Index de la aplicación (login)
app.get('/www', function(req, res){
  res.render('index', { });
});

// Iniciar servidor
app.listen(port);
console.log('Sevidor corriendo en: http://localhost:' + port);

//Exportar módulo (para reutilizarse en servicios)
module.exports = app;
