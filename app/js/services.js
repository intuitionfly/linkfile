var projectServices = angular.module('projectServices', ['ngResource']);

projectServices.factory('Project', ['$resource',
	function($resource){
		return $resource('projects/projects.json');
	}]);
projectServices.factory('LinkFileGenerator', ['$resource',
	function($resource){
	  return $resource('/submitLinkInfo');
	}]);