angular.module('app.controllers', [])

.controller('signBookCtrl', function($scope, $rootScope, $ionicModal, localStorageService) {

    //$scope.entry = { img: '', terms: '' };

    /*$scope.entries = [
    { img: 'caprisun', terms: [['capri', 'zJqLH8EA2rM'], ['sun', 'zJqLH8EA2rM']] },
    { img: 'beans', terms: [['great', 'zJqLH8EA2rM'], ['northern', 'zJqLH8EA2rM'], ['beans', 'zJqLH8EA2rM']] },
	{ img: 'hotdogs', terms: [['premium', 'zJqLH8EA2rM'], ['jumbo', 'zJqLH8EA2rM'], ['beef', 'zJqLH8EA2rM'], ['franks', 'zJqLH8EA2rM']] }
  ];*/

    $rootScope.entry = {
        img: 'hotdogs',
        terms: [
            ['capri', 'zJqLH8EA2rM'],
            ['sun', 'zJqLH8EA2rM']
        ]
    };

    $ionicModal.fromTemplateUrl('templates/signBookEntry.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.show = function(e) {
        $scope.entry = e;
        $scope.modal.show();
    }

    $scope.getEntries = function() {
        if (localStorageService.get('entryData')) {
            $rootScope.entries = localStorageService.get('entryData');
        } else {
            $rootScope.entries = [];
        }
        localStorageService.set('entryData', $scope.entries);
    }

    $scope.removeEntry = function(e) {
        $rootScope.entries.splice(e, 1);
        localStorageService.set('entryData', $rootScope.entries);
    }

})

.controller('cameraCtrl', function($scope, $rootScope, $ionicModal, $ionicLoading, Camera, localStorageService) {

      $scope.takePicture = function (options) {

      var options = {
         quality : 75,
         targetWidth: 1080,
         destinationType: navigator.camera.DestinationType.DATA_URL,
         sourceType: 1,
         correctOrientation: true,
         encodingType: navigator.camera.EncodingType.JPEG
      };

      Camera.getPicture(options).then(function(imageData) {
         $scope.hide();
         $rootScope.entry.img = "data:image/jpeg;base64," + imageData;
         $scope.modal.show();
      }, function(err) {
         $scope.hide();
         console.log(err);
      });

      $ionicModal.fromTemplateUrl('templates/saveToSignBook.html', {
          scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.show();
      });

      $scope.show = function() {
          $ionicLoading.show({
            template: 'Loading...'
          });
        };

        $scope.hide = function(){
          $ionicLoading.hide();
        };

    };

      $scope.addAndSave = function() {
          $rootScope.entries.push($scope.gen($rootScope.entry.img));
          localStorageService.set('entryData', $rootScope.entries);
      }

      $scope.gen = function(i) {
          var j = "{img: '" + i + "', terms: [['capri', 'zJqLH8EA2rM'],['sun', 'zJqLH8EA2rM']]}";
          return eval("(" + j + ")");
      }

})

.controller('signBookEntryCtrl', function($scope, $ionicModal) {

    $ionicModal.fromTemplateUrl('templates/video.html', {
        scope: $scope,
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.show = function(n, i) {
        $scope.name = n;
        $scope.id = i;
        $scope.modal.show();
    }

})

.controller('videoCtrl', function($scope, $sce) {

    //$scope.name = 'Sun';
    //$scope.id = 'HUlvWv-oKk';
    $scope.getUrl = function() {
        $scope.url = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + $scope.id + '?rel=0&amp;showinfo=0');
        return $scope.url;
    }

})
