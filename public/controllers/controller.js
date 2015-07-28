var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Reached controller");


    var refresh = function() {
        $http.get('/urlList').success(function(response) {
            console.log("GET Successful");
            $scope.urlList = response;
            $scope.entry = "";
        });
    };

    refresh();

    $scope.addEntry = function() {
        console.log($scope.entry);
        $http.post('/urlList', $scope.entry).success(function(response) {
            console.log(response);
            refresh();
        });
    };

    $scope.remove = function(id) {
        console.log(id + "removed");
        $http.delete('/urlList/' + id).success(function(response) {
            refresh();
        });
    };

    $scope.edit = function(id) {
        console.log(id + "edited");
        $http.get('/urlList/' + id).success(function(response) {
            $scope.entry = response;
        });
    };

    $scope.update = function() {
        console.log($scope.entry._id + "Updated");
        $http.put('/urlList/' + $scope.entry._id, $scope.entry).success(function(response) {
            refresh();
        })
    };

    $scope.deselect = function() {
        $scope.entry = "";
    }

}]);