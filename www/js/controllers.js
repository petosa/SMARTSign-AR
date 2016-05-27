angular.module('app.controllers', [])
     
.controller('signBookCtrl', ['$scope', '$http', function($scope, $http) {

	$http.get('js/data.json').success(function(data) {
		$scope.artists = data;
	});
}])
   
.controller('cameraCtrl', function($scope) {

})
   
.controller('oCRTextCtrl', function($scope) {

})
   
.controller('oCRText2Ctrl', function($scope) {

})
 