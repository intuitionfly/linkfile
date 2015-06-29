angular.module('linkfile.project', [ 'ngRoute', 'projectServices' ])
.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/project/:projectId', {
		templateUrl : 'project/project.html',
		controller : 'ProjectCtrl'
	});
} ])
.controller('ProjectCtrl', ['$scope', '$routeParams', 'Project', 'LinkFileGenerator', 
	function($scope, $routeParams, Project, LinkFileGenerator) {
		$scope.funcNames = [{
			"funcName" : "CVStoLink"
		}, {
			"funcName" : "UniCode"
		}, {
			"funcName" : "ASCII"
		}, {
			"funcName" : "ReConvert"
		}];
		$scope.funcName = "CVStoLink";
		$scope.isCVStoLink = true;
		$scope.inputtext = "";
		$scope.outputtext = "";
		$scope.emptySubmitter=false;
		$scope.emptyShortDesc=false;
		$scope.emptyLinkInfo=false;
		$scope.submitterEmptyMsg="Submitter is empty!";
		$scope.shortDescEmptyMsg="Short Description is empty!";
		$scope.linkInfoEmptyMsg="Link info is empty!";
		
		$scope.setFuncName = function (funcName){
			$scope.funcName = funcName;
			if(funcName == "CVStoLink"){
				$scope.isCVStoLink = true;
			} else {
				$scope.isCVStoLink = false;
				$scope.emptySubmitter=false;
				$scope.emptyShortDesc=false;
				$scope.emptyLinkInfo=false;
			}
		}
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
		$scope.convertText = function(){
			switch($scope.funcName){
			case "CVStoLink":
				$scope.outputtext = cvsLogToLinklist($scope.inputtext);
				break;
			case "UniCode":
				$scope.outputtext = unicode($scope.inputtext);
				break;
			case "ASCII":
				$scope.outputtext = ascii($scope.inputtext);
				break;
			case "ReConvert":
				$scope.outputtext = reconvert($scope.inputtext);
				break;
			}
		}
		$scope.submitLink = function(){
			$scope.emptySubmitter=false;
			$scope.emptyShortDesc=false;
			$scope.emptyLinkInfo=false;
			var hasError = false;
			if(trimStr($scope.submitter)==""){
				$scope.emptySubmitter=true;
				$scope.hasError=true;
			}
			if(trimStr($scope.shortDesc)==""){
				$scope.emptyShortDesc=true;
				$scope.hasError=true;
			}
			if(trimStr($scope.outputtext)==""){
				$scope.emptyLinkInfo=true;
				$scope.hasError=true;
			}
			if(hasError){
				return;
			}
			if(confirm("Really send?")==true){
				//submit the form
				var nowTime = new Date();
				var nowYear = nowTime.getFullYear();
				var nowMonth = nowTime.getMonth() < 10 ? '0' + (nowTime.getMonth()+1) : (nowTime.getMonth()+1);
				var nowDate = nowTime.getDate() < 10 ? '0' + nowTime.getDate() : nowTime.getDate();
				var dateText = nowYear+nowMonth+nowDate;
				var fileName = dateText+'_'+$scope.submitter+'_'+$scope.shortDesc.replace(/(^\s*)|(\s*$)/g, "").replace(/\s/g, "_")+'_'+nowTime.getTime()+'.txt';
				LinkFileGenerator.save({
					fileName: fileName,
					projectId: $scope.projectId,
					linkInfo: $scope.outputtext,
					mailTo: $scope.mailTo,
					mailCc: $scope.mailCc
				}, function(response){
					$scope.message = response.message;
					
				});
			}
		}
	} ]);

function ascii(str){
	return str.replace(/[^\u0000-\u00FF]/g,function($0){return escape($0).replace(/(%u)(\w{4})/gi,"\&#x$2;")});
}

function unicode(str){
	return str.replace(/[^\u0000-\u00FF]/g,function($0){return escape($0).replace(/(%u)(\w{4})/gi,"\\u$2")});
}

function reconvert(str){ 
	str = str.replace(/(\\u)(\w{4})/gi,function($0){
	             return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{4})/g,"$2")),16)));
	             });
	            
	str = str.replace(/(&#x)(\w{4});/gi,function($0){
	             return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{4})(%3B)/g,"$2"),16));
	             });            
	return str;
}

//RQIN 2012-11-13
function cvsLogToLinklist(src){
	var prefix_ver = "new revision: ";
	var prefix_ver1 = "initial revision: ";
	var prefix_path = "";
	var pieces = src.split("\n");
	var i = 0;
	var res = "";
	while (i < pieces.length && pieces.length > 1){
		var path = trimStr(pieces[i]);
		var ver = trimStr(pieces[i + 1]);
		i++;
		var prefix = "";
		if (0 == ver.indexOf(prefix_ver)){
			prefix = prefix_ver;
		}else if (0 == ver.indexOf(prefix_ver1)){
			prefix = prefix_ver1;
		}
		if (0 < prefix.length){

			path = path.substring(prefix_path.length, path.indexOf(","));

			path = path.replace(/\//g, "\\");
			var pathChars = path.split("\\");
			var gapIndex = ver.indexOf(";");
			if (gapIndex > 0){
				ver = ver.substring(prefix.length, gapIndex);
			}else{
				ver = ver.substring(prefix.length);
			}
			path = pathChars.slice(3).join("\\");
			res += ver + "\t" + path + "\n";
		}
	}
	
	return res;
}

function trimStr(text){
	return (text || "").replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "" );
}