'use strict';

angular.module('questionaryApp')
  .service('FondesoProfile', ['$http', function($http){
    var baseUrl = 'http://localhost:3000';
    // var baseUrl = 'http://fondeso.herokuapp.com';
    var api = {
      all: function(){
        var url = baseUrl + '/funds.json';
        return $http.get(url);
      },
      category: function(category, filters){
        var url = baseUrl + '/profile/' + category + '/';
        return $http.post(url, { filters: filters });
      }
    }
    return api;
  }]);
