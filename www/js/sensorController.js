angular.module('sensor.controller', [])

.controller('SensorCtrl', function($scope, $ionicPopup, $state, LoginService) {

    $scope.data = {};

    $scope.capture = function(){

      //Capturar data 
      LoginService.captureCredentials().success(function(data){

        //Data recibida
        var received = data;

        console.log(received[0]['name']);

        //Objeto cliente
        var cliente = {
          username : received[0]['name'], //Viene del array credenciales en LoginService
          password: received[0]['secret'] //Viene del array credenciales en LoginService
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


                });


      }).error(function(data){
        console.log('Error trayendo los datos de usuario')
      });

    }


});
