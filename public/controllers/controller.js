var myApp = angular.module('myApp', ['angularUtils.directives.dirPagination']);
(function () {
    myApp.controller('AppCtrl', ['$http', function ($http) {
        "use strict";
        var jspListCtrl = this;

        var refresh = function () {
            $http.get('/urlList').success(function (response) {
                console.log("GET Successful");
                jspListCtrl.urlList = response;
                jspListCtrl.entry = "";
            });
        };

        jspListCtrl.sort = "";
        jspListCtrl.setSort = function(option) {
            if (option === jspListCtrl.sort) {
                jspListCtrl.sort = "-"+option;
            } else {
                jspListCtrl.sort = option;
            }
        };

        /* Array of JSPs */
        jspListCtrl.jsps = [{id: 'jsp1', value: ""}];

        refresh();

        /* helper function, converts include array to string */
        var getEntryJSP = function() {
            var jspString = "";
            for(var jsp in jspListCtrl.jsps){
                if(jspListCtrl.jsps[jsp].value !== undefined){
                    jspString += jspListCtrl.jsps[jsp].value + ",";
                }
            }
            jspString = jspString.substring(0, jspString.length - 1);
            return jspString;
        };

        /* helper function, converts include string to array */
        var getEditJSP = function(response) {
            jspListCtrl.jsps = [];
            var newJspNo = 1;
            var res = response.jsp.split(",");
            for(var i =0; i<res.length;i++){
                jspListCtrl.jsps.push({'id': 'jsp'+newJspNo, 'value': res[i]});
                newJspNo = jspListCtrl.jsps.length+1;
            }
        };

        jspListCtrl.addEntry = function () {
            jspListCtrl.entry.jsp = getEntryJSP();
            console.log(jspListCtrl.entry);
            $http.post('/urlList', jspListCtrl.entry).success(function (response) {
                refresh();
                console.log(jspListCtrl.entry + " Added");
            });
        };

        jspListCtrl.remove = function (id) {
            console.log(id + "removed");
            $http.delete('/urlList/' + id).success(function (response) {
                refresh();
            });
        };

        jspListCtrl.edit = function (id) {
            console.log(id + " Edited");
            $http.get('/urlList/' + id).success(function (response) {
                jspListCtrl.entry = response;
                getEditJSP(jspListCtrl.entry);
                console.log("Entrys " + jspListCtrl.entry.jsp);
            });
        };

        jspListCtrl.update = function () {
            console.log(jspListCtrl.entry);
            jspListCtrl.entry.jsp = getEntryJSP();
            console.log(jspListCtrl.entry._id + " Updated");
            $http.put('/urlList/' + jspListCtrl.entry._id, jspListCtrl.entry).success(function (response) {
                refresh();
            });
        };

        /* Adds JSP, add button in add entry */
        jspListCtrl.addNewJSP = function () {
            var newJspNo = jspListCtrl.jsps.length + 1;
            jspListCtrl.jsps.push({'id': 'jsp' + newJspNo, 'value': ""});
        };

        /* Removes JSP, regular table action */
        jspListCtrl.removeJSP = function () {
            var lastItem = jspListCtrl.jsps.length - 1;
            if (lastItem !== 0 || lastItem < 0) {
                jspListCtrl.jsps.splice(lastItem);
            }
        };

        /* Resets Include Fields, clear button in add entry */
        jspListCtrl.resetJSP = function () {
            jspListCtrl.jsps = [{id: 'jsp1', value: ""}];
            jspListCtrl.entry = "";
        };

    }]);

})();