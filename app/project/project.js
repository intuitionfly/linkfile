angular.module('linkfile.project', [ 'ngRoute', 'projectServices' ])
.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/project/:projectId', {
		templateUrl : 'project/project.html',
		controller : 'ProjectCtrl'
	});
} ])
.controller('ProjectCtrl', ['$scope', '$routeParams', 'Project',
	function($scope, $routeParams, Project) {
		$scope.funcNames = [{
			"funcName" : "CVStoLink",
			"filterName" : "liu.wu@cn.premiumit.com"
		}, {
			"funcName" : "UniCode",
			"filterName" : "liu.wu@cn.premiumit.com"
		}, {
			"funcName" : "ASCII",
			"filterName" : "liu.wu@cn.premiumit.com"
		}, {
			"funcName" : "ReConvert",
			"filterName" : "liu.wu@cn.premiumit.com"
		}];
		
		$scope.setFuncName = function (funcName){
			$scope.funcName = funcName;
		}
		
		$scope.funcName = $scope.funcNames[0].funcName;
		$scope.projects = Project.query(function() {
			$scope.projectId = "";
			for (var i = 0; i < $scope.projects.length; i++) {
				if ($scope.projects[i].projectId == $routeParams.projectId) {
					$scope.projectId = $scope.projects[i].projectId;
					$scope.mailTo = $scope.projects[i].mailTo;
					$scope.mailCc = $scope.projects[i].mailCc;
					break;
				}
			}
			if (i == $scope.projects.length) {
				window.location = "#/welcome";
			}
		});
		
	} ]);