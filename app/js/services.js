var projectServices = angular.module('projectServices', ['ngResource']);

projectServices.factory('Project', ['$resource',
  function($resource){
    return $resource('projects/projects.json');
  }]);
