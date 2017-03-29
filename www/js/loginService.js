angular.module('login.service', [])

.service('LoginService', function($q) {

  //Array que guarda el name y pw de usuario
  var credenciales = [];

  //Funcion login
  loginUser = function(name, pw) {
      var deferred = $q.defer();
      var promise = deferred.promise;

      if (name == 'alice' && pw == 'secret') {
          deferred.resolve('Bienvenido ' + name + '!');

          //Objeto para pasar al array
          var resuelto = {
            name : name,
            secret: pw
          }

          credenciales.push(resuelto);

      } else {
          deferred.reject('Credenciales erróneas');
      }
      promise.success = function(fn) {
          promise.then(fn);
          return promise;
      }
      promise.error = function(fn) {
          promise.then(null, fn);
          return promise;
      }
      return promise;
  };

  //Función para capturar la data y reutilizarla
  captureCredentials = function(){

    var deferred = $q.defer();
    var promise = deferred.promise;

    deferred.resolve(credenciales);

    deferred.reject("Error");

    promise.success = function(fn) {
        promise.then(fn);
        return promise;
    }
    promise.error = function(fn) {
        promise.then(null, fn);
        return promise;
    }
    return promise;

  };
    //Retornar ambas funciones
    return {
      loginUser: loginUser,
      captureCredentials: captureCredentials,
    }
})
