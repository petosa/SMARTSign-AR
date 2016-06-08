angular.module('app.controllers', [])

.controller('signBookCtrl', function($scope, $rootScope, $ionicModal, localStorageService) {

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

.controller('cameraCtrl', function($scope, $rootScope, $ionicModal, $http, $ionicLoading, Camera, localStorageService) {

    //When user clicks camera tab
    $scope.takePicture = function(options) {

        //Run at start, create modal and spawn load screen
        $ionicModal.fromTemplateUrl('templates/saveToSignBook.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.loading();
        });

        //Picture options
        var options = {
            quality: 75,
            targetWidth: 1080,
            destinationType: navigator.camera.DestinationType.DATA_URL,
            sourceType: 1,
            correctOrientation: true,
            encodingType: navigator.camera.EncodingType.JPEG
        };

        //Launch camera
        Camera.getPicture(options).then(function(imageData) {
            //Interpret image text
            $scope.gcloud(imageData);
            //Set entry data
            $rootScope.entry.img = "data:image/jpeg;base64," + imageData;
            $rootScope.entry.terms = [];
        }, function(err) {
            $scope.unloading();
            console.log(err);
        });

    };

    $scope.addAndSave = function() {
        $rootScope.entries.push($scope.gen($rootScope.entry.img, $rootScope.entry.terms));
        localStorageService.set('entryData', $rootScope.entries);
    }

    $scope.gen = function(i, t) {
        var j = "{img: '" + i + "', terms: " + JSON.stringify(t) + "}";
        return eval("(" + j + ")");
    }

    $ionicModal.fromTemplateUrl('templates/video.html', {
        scope: $scope,
    }).then(function(modal) {
        $scope.videoModal = modal;
    });

    $scope.show = function(t, i) {
        $scope.name = t;
        $scope.id = i;
        $scope.videoModal.show();
    }

    $scope.gcloud = function(content) {

        //Format data json
        var json = '{' + ' "requests": [' + '	{ ' + '	  "image": {' +
            '	     "content":"' + content + '"' + '	  },' + '	  "features": [' +
            '	      {' + '	      	"type": "TEXT_DETECTION",' +
            '			"maxResults": 200' + '	      }' + '	  ]' + '	}' + ']' + '}';

        //Post
        $http({
            method: 'POST',
            url: 'https://vision.googleapis.com/v1/images:annotate?key=API_KEY_GOES_HERE',
            data: json,
            headers: {
                "Content-Type": "application/json"
            }
            //On successful callback
        }).then(function successCallback(response) {
            try {
                $scope.format(JSON.stringify(response.data.responses[0].textAnnotations[0].description), true);
            } catch (e) {
                $scope.format("", false);
            }
            //On error callback
        }, function errorCallback(response) {
            $scope.format("", false);
        });

    }

    $scope.youtube = function(query) {
        var url = 'http://smartsign.imtc.gatech.edu/videos?keywords=' + query;
        $http.jsonp(url + "&callback=JSON_CALLBACK").success(function(data) {
            try {
                var videoObj = {
                    name: query,
                    id: data[0].id,
                    videoTitle: data[0].keywords
                };
                $rootScope.entry.terms.push(videoObj);
                console.log("Accepted " + query + ": " + data[0].keywords);
            } catch (e) {
                console.log("Rejected " + query);
            }
        });
    }

    $scope.format = function(tags, success) {

        while (tags.indexOf('\"') != -1) {
            tags = tags.replace('\"', "");
        }
        while (tags.indexOf(String.fromCharCode(92) + "n") != -1) {
            tags = tags.replace(String.fromCharCode(92) + "n", " ");
        }

        var arr = tags.split(" ");

        for (var i = 0; i < arr.length; i++)
            if (arr[i] != "")
                $scope.youtube(arr[i].replace("'d", "").replace("'D", "").replace("'s", "").replace("'S", ""));

        $scope.finish(success);
    }

    $scope.loading = function() {
        $ionicLoading.show({
            template: 'Loading...'
        });
    };

    $scope.unloading = function() {
        $ionicLoading.hide();
    };

    $scope.finish = function(success) {
        $scope.unloading();
        if (success)
            $scope.modal.show();
    }

})

.controller('signBookEntryCtrl', function($scope, $ionicModal) {

    $ionicModal.fromTemplateUrl('templates/video.html', {
        scope: $scope,
    }).then(function(modal) {
        $scope.videoModal = modal;
    });

    $scope.show = function(n, i) {
        $scope.name = n;
        $scope.id = i;
        $scope.videoModal.show();
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