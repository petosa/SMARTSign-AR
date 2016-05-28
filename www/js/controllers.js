angular.module('app.controllers', [])
     
.controller('signBookCtrl', function($scope, $ionicModal) {
		
  $scope.entry = { name: '', id: '' };
  $scope.entries = [
    { name: 'Gordon Freeman', id: 'HUlvWv-oKHk' },
    { name: 'Barney Calhoun', id: 'HUlvWv-oKk' },
    { name: 'Lamarr the Headcrab', id: 'HUlvWv-oKk' },
  ];

  $ionicModal.fromTemplateUrl('templates/signBookEntry.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  
  $scope.show = function(e) {
	  $scope.entry = e;
	  $scope.modal.show();
  }
  
})
   
.controller('cameraCtrl', function($scope) {

})
   
.controller('signBookEntryCtrl', function($scope, $ionicModal) {

   $ionicModal.fromTemplateUrl('templates/video.html', {
    scope: $scope,
  }).then(function(modal) {
    $scope.modal = modal;
  });
    
})
   
.controller('saveToSignBookCtrl', function($scope) {

})

.controller('videoCtrl', function($scope, $sce) {
	
	//$scope.name = 'Sun';
	//$scope.id = 'HUlvWv-oKk';
	$scope.getUrl = function() {
		$scope.url = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + $scope.entry.id + '?rel=0&amp;showinfo=0');
		return $scope.url;
	}
	
})
 