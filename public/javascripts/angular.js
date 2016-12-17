var app = angular.module('oispaApp', []);

app.controller('oispaController', function($scope, oispaFactory, $filter) {
	var makkara = ':)';
	oispaFactory.get().then(function(data){
		$scope.makkaramix = data.data.message;
	});
	$scope.makkaramix = makkara;
	$scope.thisyear = $filter('date')(new Date(), 'yyyy');
});

app.factory('oispaFactory', function($http){
	var factory = {};
	factory.get = function(){
		return $http.get('/api');
	};
	return factory;
});