var app = angular.module('oispaApp', []);

app.controller('oispaController', function($scope, oispaFactory) {
	var makkara = ':)';
	oispaFactory.get().then(function(data){
		$scope.makkaramix = data.data.message;
	});
	$scope.makkaramix = makkara;
});

app.factory('oispaFactory', function($http){
	var factory = {};
	factory.get = function(){
		return $http.get('/api');
	};
	return factory;
});