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



    }
})
