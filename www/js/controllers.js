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

        for (var i in $rootScope.entries) {
            if ($rootScope.entries[i]['img'] == e['img']) {
                $scope.index = i;
            }
        }
        $rootScope.entries.splice($scope.index, 1);
        localStorageService.set('entryData', $rootScope.entries);
    }

})

.controller('cameraCtrl', function($scope, $rootScope, localStorageService) {

    $scope.createEntry = function() {
        $rootScope.entries.push($rootScope.entry);
        localStorageService.set('entryData', $rootScope.entries);
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

.controller('saveToSignBookCtrl', function($scope) {

})

.controller('videoCtrl', function($scope, $sce) {

    //$scope.name = 'Sun';
    //$scope.id = 'HUlvWv-oKk';
    $scope.getUrl = function() {
        $scope.url = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + $scope.id + '?rel=0&amp;showinfo=0');
        return $scope.url;
    }

})