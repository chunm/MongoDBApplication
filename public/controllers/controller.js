var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    //console.log("Reached controller");

    /* Array of JSPs */
    $scope.jsps = [{id: 'jsp1'}];

    var refresh = function() {
        $http.get('/urlList').success(function(response) {
            console.log("GET Successful");
            $scope.urlList = response;
            $scope.entry = "";
			//console.log(response);
        });
    };

    var getEntryJSP = function() {
        var jspString = "";
        for(var jsp in $scope.jsps){
            jspString += $scope.jsps[jsp].value + ",";
        }
        jspString = jspString.substring(0, jspString.length - 1);
        //console.log('JSP STRING: ' + jspString);
        return jspString;
    };

    var getEditJSP = function(response) {
        $scope.jsps = [];
        var newJspNo = 1;
        var res = response.jsp.split(",");
        for(var i =0; i<res.length;i++){
            $scope.jsps.push({'id': 'jsp'+newJspNo, 'value': res[i]});
            newJspNo = $scope.jsps.length+1;
        }
    };

    refresh();

    $scope.addEntry = function() {
        $scope.entry.jsp = getEntryJSP();
        $http.post('/urlList', $scope.entry).success(function(response) {
            refresh();
            console.log($scope.entry + " Added");
        });
    };

    $scope.remove = function(id) {
        console.log(id + "removed");
        $http.delete('/urlList/' + id).success(function(response) {
            refresh();
        });
    };

    $scope.edit = function(id) {
        console.log(id + " Edited");
        $http.get('/urlList/' + id).success(function(response) {
            $scope.entry = response;
            getEditJSP($scope.entry);
        });
    };

    $scope.update = function() {
        $scope.entry.jsp = getEntryJSP();
        console.log($scope.entry._id + " Updated");
        $http.put('/urlList/' + $scope.entry._id, $scope.entry).success(function(response) {
            refresh();
        })
    };

    $scope.mySplit = function(string, nb) {
        if(string !== undefined){
            $scope.array = string.split(',');
            return $scope.result = $scope.array[nb];
        }
        else{
            return $scope.result;
        }
    }

    /* Add JSP */
    $scope.addNewJSP = function(){
        var newJspNo = $scope.jsps.length+1;
        $scope.jsps.push({'id': 'jsp'+newJspNo});
    };

    /* Remove JSP */
    $scope.removeJSP = function(){
        var lastItem = $scope.jsps.length-1;
        if(lastItem !== 0){
            $scope.jsps.splice(lastItem);
        }
    };

    /* Reset Include Field */
    $scope.resetJSP = function(){
        $scope.jsps = [{id: 'jsp1'}];
        $scope.entry = "";
    };

}]);

myApp.filter('trustAsHTML', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);