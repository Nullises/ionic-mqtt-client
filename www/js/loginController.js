angular.module('login.controller', [])

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {
    $scope.data = {};

    $scope.login = function() {

        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
            $state.go('sensor');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Registro Fallido',
                template: 'Por favor revise sus credenciales'
            });
        });

        //Capturar data (TEMPORAL)
        LoginService.captureCredentials($scope.data.username, $scope.data.password).success(function(data){

          //Data recibida
          var received = data;

          //Objeto cliente
          var cliente = {
            username : received.name,
            password: received.secret
          }

          console.log(cliente.username);
          console.log(cliente.password);

          //MQTT
          var mqttServer = {
            url: 'ws://104.41.60.94',
            port: 3000,
            protocolId: 'MQTT'
          };

          var Client;
          var timestamp = Date.now();

          Client = mqtt.connect(mqttServer.url + ":" + mqttServer.port, {
            username: cliente.username,
            password: cliente.password,
            protocolId: mqttServer.protocolId,
            clientId: timestamp + ':' + cliente.username
          });

          Client.subscribe("users/"+cliente.username+"/#");

          Client.on("connect", function(){
            console.log("Succesfully conected to mqtt broker");

            console.log("Publishing to users/%s/report", cliente.username);
            Client.publish("users/"+cliente.username+"/report", "gooby pls!");
          });

          Client.on("message", function (topic, payload){
                    console.log("New incoming message: ", [topic, payload].join(": "));
                    //making sense of the recived message (topic and payload)
                    var route = topic.split("/");
                    var payload;
                    try{
                      payload = JSON.parse(payload);
                    }catch(e){
                      payload = null;
                    }

                    var message = {

                      username : route[1], //username
                      deviceId : route[2], //device id
                      type     : route[3], //sensor, actuator, register
                      name     : route[4], //sensor, actuator or device alias (temperature, relay1, server-room)
                      data     : payload  //payload recived
                    };



                    switch (message.type) {
                      case 'register':
                          console.log('Mensaje de tipo: ', message.type);
                          //registerDevice(message); //i really dont know why im doing this...
                        break;
                      case 'sensor':
                          //upsertSensorView(message);
                          console.log('Mensaje de tipo: ', message.type);
                        break;
                      case 'actuator':
                          console.log('Mensaje de tipo: ', message.type);
                          //upserActuatorView(message);
                        break;
                      default:
                        console.log("unknown message type %s", message.type);
                    }
                  });


        }).error(function(data){
          console.log('Error trayendo los datos de usuario')
        });

    }
})
