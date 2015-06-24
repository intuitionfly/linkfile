angular.module('linkfile', [
  'ngRoute',
  'linkfile.welcome',
  'linkfile.project'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/welcome'});
}]);
