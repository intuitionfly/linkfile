angular.module('linkfile.welcome', [ 'ngRoute' ])

.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/welcome', {
		templateUrl : 'welcome/welcome.html',
		controller : 'WelcomeCtrl'
	});
} ])

.controller('WelcomeCtrl', [ function() {
	
} ]);