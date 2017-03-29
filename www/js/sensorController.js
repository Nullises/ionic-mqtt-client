angular.module('sensor.controller', [])

.controller('SensorCtrl', function($scope, $ionicPopup, $state, LoginService) {

    $scope.data = {};

    $scope.temperature; //Vista
    $scope.humidity; //Vista

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

                  //console.log("New incoming message: ", [topic, payload].join(": "));
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
                    registerDevice(message);
                    break;
                    case 'sensor':
                    upsertSensorView(message);
                    break;
                    case 'actuator':
                    upserActuatorView(message);
                    break;
                    default:
                    console.log("unknown message type %s", message.type);
                  }
                });


                function registerDevice(message){
                  var currentDevice = _.find(Devices, function(device){
                    return device.id == message.deviceId;
                  });

                  //if the device is not allready registered then add it to the Devices collection
                  if(!currentDevice){
                    currentDevice = {
                      id        : message.deviceId,
                      name      : message.name,
                      sensors   : message.data.sensors,
                      actuators : message.data.actuators
                    };
                  }

                  Devices[currentDevice.id] = currentDevice;
                }


                function upsertSensorView(message){

                  $scope.humidity = message.data.value;
                  $scope.temperature = message.data.value;

                  console.log($scope.humidity);
                  console.log($scope.temperature);

                  /*var componentId = [
                    message.deviceId,
                    message.type, //here type will allways equal to "sensor"
                    message.name
                  ].join('-');

                  if(componentId === 'fakeid-sensor-temperature'){
                    //console.log(message.data.value);
                    $scope.temperature = message.data.value;
                  }else if(componentId === 'fakeid-sensor-humidity'){
                    //console.log(message.data.value);
                    $scope.humidity = message.data.value;
                  }*/

                  //console.log(message.data.value);

                  //$scope.temperature = message.data.value;
                  //$scope.humidity = message.data.value;

                  //var view = $("#"+componentId)[0];

                  //console.log(view);

                  /*if(view){
                    //if the view for the sensor its allready rendererd update his values
                    $(view).find(".sensor-value").html(message.data.value);
                    $(view).find(".sensor-origin").html(message.data.origin);
                  }else{
                    //if not, add it to the main-page
                    var ctx = {
                      id     : componentId,
                      origin : message.data.origin,
                      value  : message.data.value
                    };
                    var html = Handlebars.templates[message.name](ctx);
                    $("#main-page").append(html);
                  }*/
                }

                function upserActuatorView(){

                }


      }).error(function(data){
        console.log('Error trayendo los datos de usuario')
      });

    }


});
