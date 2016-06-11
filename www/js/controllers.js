angular.module('app.controllers', [])

.controller('signBookCtrl', function($scope, $rootScope, $ionicModal, localStorageService) {

    $rootScope.entry = {
        img: 'hotdogs',
        terms: [
            ['capri', 'zJqLH8EA2rM'],
            ['sun', 'zJqLH8EA2rM']
        ]
    };

    //Define a modal from the signBookEntry template
    $ionicModal.fromTemplateUrl('templates/signBookEntry.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    //Display the stored modal
    $scope.show = function(e) {
        $scope.entry = e;
        $scope.modal.show();
    }

    //Discover stored entry data and load it into a variable
    $scope.getEntries = function() {
        if (localStorageService.get('entryData')) {
            $rootScope.entries = localStorageService.get('entryData');
        } else {
            $rootScope.entries = [];
        }
        localStorageService.set('entryData', $scope.entries);
    }

    //Remove a list item from memory and storage
    $scope.removeEntry = function(e) {
        $rootScope.entries.splice(e, 1);
        localStorageService.set('entryData', $rootScope.entries);
    }
	
	$rootScope.deleteOn = false;
	
	$rootScope.toggleDelete = function() {
		console.log($rootScope.deleteOn);
		$rootScope.deleteOn = !$rootScope.deleteOn;
		if($rootScope.deleteOn)
			$rootScope.currentTheme = "tabs-assertive"
		else
			$rootScope.currentTheme = "tabs-dark"
	}

})

.controller('cameraCtrl', function($scope, $rootScope, $ionicPopup, $ionicModal, $http, $ionicLoading, Camera, localStorageService) {

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

    //Add the current entry to the entries array and save in storage
    $scope.addAndSave = function() {
        $rootScope.entries.push($scope.gen($rootScope.entry.img, $rootScope.entry.terms));
        localStorageService.set('entryData', $rootScope.entries);
    }

    //Return a json object containing a stringified image and its terms
    $scope.gen = function(i, t) {
        var j = "{img: '" + i + "', terms: " + JSON.stringify(t) + "}";
        return eval("(" + j + ")");
    }

    //Define a modal from the video template
    $ionicModal.fromTemplateUrl('templates/video.html', {
        scope: $scope,
    }).then(function(modal) {
        $scope.videoModal = modal;
    });

    //Open the saved modal
    $scope.show = function(t, i) {
		if(i != "") {
			$scope.name = t;
			$scope.id = i;
			$scope.videoModal.show();
		}
    }

    //Define the gcloud function to parse 
    $scope.gcloud = function(content) {

        //Format data json
        var json = '{' + ' "requests": [' + '	{ ' + '	  "image": {' +
            '	     "content":"' + content + '"' + '	  },' + '	  "features": [' +
            '	      {' + '	      	"type": "TEXT_DETECTION",' +
            '			"maxResults": 200' + '	      }' + '	  ]' + '	}' + ']' + '}';

        //Post
        $http({
            method: 'POST',
            url: 'https://vision.googleapis.com/v1/images:annotate?key=YOUR_API_KEY',
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

	String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
	};
	
    //Query the CATS database for a phrase 
    $scope.youtube = function(query, raw, ind) {
        var url = 'http://smartsign.imtc.gatech.edu/videos?keywords=' + query;
		if(query != "") {
        $http.jsonp(url + "&callback=JSON_CALLBACK").success(function(data) {
            try {
                var videoObj = {
                    name: raw,
                    id: data[0].id,
                    videoTitle: data[0].keywords.toString().replaceAll(",",", "),
					index: ind,
					color: "button-positive"
                };
                $rootScope.entry.terms.push(videoObj);
                console.log("Accepted " + query + ": " + data[0].keywords);
            } catch (e) {
				var videoObj = {
                    name: raw,
                    id: "",
                    videoTitle: "",
					index: ind,
					color: ""
                };
				$rootScope.entry.terms.push(videoObj);
                console.log("Rejected " + query);
            } finally {
                $scope.phrasesParsed = $scope.phrasesParsed + 1;
                console.log($scope.phrasesParsed + " of " + $scope.totalPhrases)
                if ($scope.phrasesParsed == $scope.totalPhrases) {
                    $scope.finish(true);
                }
            }
        });
		} else {
			var videoObj = {
                    name: raw,
                    id: "",
                    videoTitle: "",
					index: ind,
					color: ""
                };
				$rootScope.entry.terms.push(videoObj);
                console.log("Rejected " + query);
				$scope.phrasesParsed = $scope.phrasesParsed + 1;
                console.log($scope.phrasesParsed + " of " + $scope.totalPhrases)
                if ($scope.phrasesParsed == $scope.totalPhrases) {
                    $scope.finish(true);
                }
		}
    }

    $scope.format = function(tags, success) {

		if(!success) {
			$scope.unloading();
			$scope.showAlert();
		}
	
        while (tags.indexOf('\"') != -1) {
            tags = tags.replace('\"', "");
        }
        while (tags.indexOf(String.fromCharCode(92) + "n") != -1) {
            tags = tags.replace(String.fromCharCode(92) + "n", " ");
        }

        var arr = tags.split(" ");

        $scope.totalPhrases = arr.length - 1;
        $scope.phrasesParsed = 0;

        for (var i = 0; i < arr.length; i++)
            if (arr[i] != "") {
				var temp = arr[i]
				.replace("'d", "")
				.replace("'D", "")
				.replace("'s", "")
				.replace("'S", "")
				.replace(".", "")
				.replace(",", "")
				.replace(":", "")
				.replace(";", "")
				.replace("?", "")
				.replace("!", "")
				.replace("&", "");
				
                $scope.youtube(temp, arr[i], i);
			}
    }

    //Show loading screen
    $scope.loading = function() {
        $ionicLoading.show({
            template: 'Loading...' + '<br><ion-spinner icon="bubbles" style="stroke:#1097EB;fill:#1097EB;"></ion-spinner>'
        });
    };

    //Show unloading screen
    $scope.unloading = function() {
        $ionicLoading.hide();
    };

	//Comparator
	$scope.compare = function(a,b) {
  if (a.index < b.index)
    return -1;
  else if (a.index > b.index)
    return 1;
  else 
    return 0;
}
	
    //Called once all data is gathered
    $scope.finish = function(success) {
		$rootScope.entry.terms.sort($scope.compare);
        $scope.unloading();
        if (success)
            $scope.modal.show();
    }
	
	//Show error
	$scope.showAlert = function() {
		var alertPopup = $ionicPopup.alert({
			title: 'Failed',
			template: 'Could not read any text. Open the camera and try again.'
		});
   };

})

.controller('signBookEntryCtrl', function($scope, $ionicModal) {

    //Store a new modal from the video template
    $ionicModal.fromTemplateUrl('templates/video.html', {
        scope: $scope,
    }).then(function(modal) {
        $scope.videoModal = modal;
    });

    //Show the store template
    $scope.show = function(n, i) {
		if(i != "") {
			$scope.name = n;
			$scope.id = i;
			$scope.videoModal.show();
		}
    }

})

.controller('videoCtrl', function($scope, $sce) {

    //Returns a validated url to the youtube video
    $scope.getUrl = function() {
        $scope.url = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + $scope.id + '?rel=0&amp;showinfo=0');
        return $scope.url;
    }

})