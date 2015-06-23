angular.module('linkfile.project', [ 'ngRoute', 'projectServices' ])

.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/project/:projectId', {
		templateUrl : 'project/project.html',
		controller : 'ProjectCtrl'
	});
} ])

.controller(
		'ProjectCtrl',
		[ '$scope', '$routeParams', 'Project',
				function($scope, $routeParams, Project) {
					try{
						$scope.project = Project.get({
							projectId : $routeParams.projectId
						}, function(project) {
							$scope.projectId = project.projectId;
							$scope.mailTo = project.mailTo;
							$scope.mailCc = project.mailCc;
						});
					}catch(e){
						window.location = "welcome"
					}
				} ]);