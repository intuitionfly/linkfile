angular.module('linkfile.welcome', [ 'ngRoute', 'projectServices' ])
.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/welcome', {
		templateUrl : 'welcome/welcome.html',
		controller : 'WelcomeCtrl'
	});
} ])
.controller('WelcomeCtrl', ['$scope', 'Project', 
	function($scope, Project) {
		$scope.projects = Project.query();
	} ]);