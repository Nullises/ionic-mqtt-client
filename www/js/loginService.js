angular.module('login.service', [])

.service('LoginService', function($q) {
    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            if (name == 'alice' && pw == 'secret') {
                deferred.resolve('Bienvenido ' + name + '!');
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
        },

        //Función para capturar la data y reutilizarla (TEMPORAL)
        captureCredentials: function(name, pw){

          var deferred = $q.defer();
          var promise = deferred.promise;

          if (name == 'alice' && pw == 'secret') {

              //Objeto credentials
              var credentials = {
                name: name,
                secret: pw
              }

              //Devolver objeto credentials en la promesa
              deferred.resolve(credentials);

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

        }

    }
})
