angular.module('app.controllers', [])

.controller('signBookCtrl', function($scope, $rootScope, $ionicModal, localStorageService) {

    $rootScope.progress = '?';
    $rootScope.progressTotal = '?';

    $rootScope.entry = {
        img: '',
        terms: [],
        select: false
    };

    var cb = localStorageService.get("currentBook");
    if (cb) {
        $rootScope.currentBook = cb;
    } else {
        $rootScope.currentBook = "Default Book";
    }

	$rootScope.lastRead = undefined;
	$rootScope.lastIndex = -1;
	$rootScope.maxIndex = -1;

	$scope.lastRead = function(item) {
		return $rootScope.lastRead == item;
	}

    $scope.getTitle = function() {
        if ($rootScope.currentBook == "Default Book") {
            return "SMARTSign AR"
        } else {
            return $rootScope.currentBook;
        }
    }

    $rootScope.colorTrash = function(bool) {
        var b = angular.element(document.querySelector('#libraryTrash'));
        if (bool) {
            b.addClass('button-assertive');
        } else {
            b.removeClass('button-assertive');
        }
    }

    $rootScope.colorReorder = function(bool) {
        var b = angular.element(document.querySelector('#libraryStack'));
        if (bool) {
            b.addClass('button-calm');
        } else {
            b.removeClass('button-calm');
        }
    }

    $scope.smartPrint = function(terms) {
        var build = "";
        for (var i = 0; i <= 20 && i < terms.length; i++) {
            build = build + " " + terms[i].name;
            if (i == 20) {
                build = build + " ...";
            }
        }
        return build;
    }

    //Define a modal from the signBookEntry template
    $ionicModal.fromTemplateUrl('templates/signBookEntry.html', {
        scope: $scope
    }).then(function(modal) {
        $rootScope.entryModal = modal;
    });

    //Display the stored modal
    $scope.show = function(e) {
		$rootScope.lastIndex = e;
		$rootScope.maxIndex = $rootScope.entries.length - 1;
        $rootScope.entry = null;
        $rootScope.entry = $rootScope.entries[e];
        $rootScope.entryModal.show();
		$rootScope.lastRead = $rootScope.entry;
    }

	$scope.nextPage = function() {
		if ($rootScope.maxIndex != $rootScope.lastIndex) {
			$rootScope.lastIndex = $rootScope.lastIndex + 1;
			$rootScope.entry = null;
			$rootScope.entry = $rootScope.entries[$rootScope.lastIndex];
			$rootScope.lastRead = $rootScope.entry;
		} else {
			$rootScope.entryModal.hide();
		}
	}

	$scope.prevPage = function() {
		if (0 != $rootScope.lastIndex) {
			$rootScope.lastIndex = $rootScope.lastIndex - 1;
			$rootScope.entry = null;
			$rootScope.entry = $rootScope.entries[$rootScope.lastIndex];
			$rootScope.lastRead = $rootScope.entry;
		} else {
			$rootScope.entryModal.hide();
		}
	}

    $scope.smartHide = function() {
        $rootScope.entryModal.hide();
    }

    //Display the stored modal
    $scope.showLibrary = function(e) {
        switch (e) {
            case 0:
                $rootScope.libraryTitle = "My Library"
                break;
            case 1:
                $rootScope.libraryTitle = "Move to which book?"
                break;
            case 2:
                $rootScope.libraryTitle = "Save to which book?"
                break;
        }
        $rootScope.libraryTrash = false;
        $rootScope.libraryStack = false;
        $rootScope.colorTrash(false);
        $rootScope.colorReorder(false);
        $scope.libraryModal = null;
        $ionicModal.fromTemplateUrl('templates/library.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.libraryModal = modal;
            $scope.libraryModal.show();
        });
    }

    //Remove a list item from memory and storage
    $scope.removeEntry = function(e) {
        $rootScope.entries.splice(e, 1);
        $rootScope.safeSet($rootScope.currentBook, $rootScope.entries);
    }

    $scope.moveEntry = function(item, fromIndex, toIndex) {
        $rootScope.entries.splice(fromIndex, 1);
        $rootScope.entries.splice(toIndex, 0, item);
        $rootScope.safeSet($rootScope.currentBook, $rootScope.entries);
    };

    $scope.trashOn = false;
    $scope.stackOn = false;
    $scope.moveOn = false;
    $scope.delIcon = "";

    $scope.flipFlop = function(ind) {
        if ($scope.trashOn) {
            $scope.removeEntry(ind);
        } else if ($scope.moveOn) {
            var state = $rootScope.entries[ind].selected;
            if (state) {
                $rootScope.entries[ind].selected = false;
            } else {
                $rootScope.entries[ind].selected = true;
            }
        }
    }

    $scope.toggleTrash = function() {
        if ($scope.moveOn)
            $scope.toggleMove();
        if ($scope.stackOn)
            $scope.toggleStack();
        $scope.trashOn = !$scope.trashOn;
        var trashIcon = angular.element(document.querySelector('#trash'));
        if ($scope.trashOn) {
            trashIcon.addClass('button-assertive');
        } else {
            trashIcon.removeClass('button-assertive');
        }
    }

    $scope.toggleMove = function() {
        if ($scope.stackOn)
            $scope.toggleStack();
        if ($scope.trashOn)
            $scope.toggleTrash();
        $scope.moveOn = !$scope.moveOn;
        for (var i = 0; i < $rootScope.entries.length; i++) {
            $rootScope.entries[i].selected = false;
        }
        var moveIcon = angular.element(document.querySelector('#move'));
        if ($scope.moveOn) {
            moveIcon.addClass('button-calm');
        } else {
            moveIcon.removeClass('button-calm');
        }
    }

    $scope.getBubble = function(ind) {
        if ($scope.trashOn)
            return "ion-trash-a"
        if ($rootScope.entries[ind].selected == false) {
            return "ion-ios-circle-outline";
        } else {
            return "ion-ios-circle-filled"
        }
    }

    $scope.toggleStack = function() {
        if ($scope.moveOn)
            $scope.toggleMove();
        if ($scope.trashOn)
            $scope.toggleTrash();
        $scope.stackOn = !$scope.stackOn;
        var stackIcon = angular.element(document.querySelector('#stack'));
        if ($scope.stackOn) {
            stackIcon.addClass('button-calm');
        } else {
            stackIcon.removeClass('button-calm');
        }
    }

    $rootScope.safeGet = function(a) {
        return localStorageService.get("." + a);
    }

    $rootScope.safeSet = function(a, b) {
        localStorageService.set("." + a, b);
    }

    $rootScope.safeRemove = function(a) {
        localStorageService.remove("." + a);
    }

    //Discover stored entry data and load it into a variable
    $rootScope.getEntries = function() {
        if ($rootScope.safeGet($rootScope.currentBook)) {
            $rootScope.entries = $rootScope.safeGet($rootScope.currentBook);
        } else {
            $rootScope.entries = [];
        }
    }
})

.controller('cameraCtrl', function($scope, $rootScope, $ionicPopup, $ionicModal, $http, $ionicLoading, Camera, $cordovaFile, localStorageService) {

	$rootScope.hardDelete = function(filename) {
		   $cordovaFile.removeFile(cordova.file.dataDirectory, filename)
      .then(function (success) {
        // success
      }, function (error) {
        // error
      });
	}

    $rootScope.rotatePicture = function() {
        var canvas = document.createElement('canvas');
        var img = angular.element(document.querySelector('imgEntry'))[0];
        var img2 = document.createElement("img");
        img2.src = $rootScope.entry.img;
		console.log($rootScope.entry.img);
        canvas.setAttribute('width', img2.height);
        canvas.setAttribute('height', img2.width);
        var context = canvas.getContext('2d');
        context.rotate(90 * Math.PI / 180);
        context.drawImage(img2, 0, -img2.height);
        context.drawImage(img2, 0, 0);

		var fileuri = $rootScope.entry.img;
		var currentName = fileuri.replace(/^.*[\\\/]/, '');
        var filePath = fileuri.replace(currentName, "");
		var d = new Date(),
                    n = d.getTime(),
                    newFileName = n + ".jpg";

		canvas.toBlob(function(blob) {

	$cordovaFile.writeFile(filePath, newFileName, blob, "image/jpeg", true)
      .then(function (success) {
		  $rootScope.hardDelete(currentName);
		  $rootScope.entry.img = filePath + newFileName;
      }, function (error) {
        // error
      });

		}, "image/jpeg");

    }

    //When user clicks camera tab
    $scope.takePicture = function(options) {

        //Clear now
        $scope.modal = null;
        $rootScope.entry = {
            img: '',
            terms: [],
            select: false
        };

        $scope.loading();

        //Picture options
        var options = {
            quality: 75,
            targetWidth: 1080,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: 1,
            correctOrientation: true,
            encodingType: navigator.camera.EncodingType.JPEG
        };

        //Launch camera
        Camera.getPicture(options).then(function(imagePath) {

            function moveFile(fileUri) {
                var currentName = imagePath.replace(/^.*[\\\/]/, '');
                var filePath = fileUri.replace(currentName, "");
                var target = cordova.file.dataDirectory;
                var d = new Date(),
                    n = d.getTime(),
                    newFileName = n + ".jpg";


                console.log(filePath)
                console.log(currentName)
                console.log(target)
                console.log(newFileName)
                $cordovaFile.moveFile(filePath, currentName, target, newFileName)
                    .then(function(success) {
                        var thePath = success.nativeURL;

                        $cordovaFile.readAsDataURL(target, newFileName)
                            .then(function(success) {
                                $rootScope.entry.terms = [];
                                $rootScope.entry.img = thePath;
                                $scope.gcloud(success.substring(23));

                            }, function(error) {
								console.log("Error1")
                            });

                    }, function(error) {
                        console.log("error flag")
                        console.log(error)
                    });

            }
            moveFile(imagePath);

        }, function(err) {
            console.log("Failed in move")
            $scope.unloading();
        });

    };

    //Add the current entry to the entries array and save in storage
    $rootScope.addAndSave = function() {
        $rootScope.entries.push($scope.gen($rootScope.entry.img, $rootScope.entry.terms));
        $rootScope.safeSet($rootScope.currentBook, $rootScope.entries);
    }

    //Return a json object containing a stringified image and its terms
    $scope.gen = function(i, t) {
        var j = "{img: '" + i + "', terms: " + JSON.stringify(t) + ", selected: false}";
        return eval("(" + j + ")");
    }

    //Define a modal from the video template
    $ionicModal.fromTemplateUrl('templates/video.html', {
        scope: $scope,
    }).then(function(modal) {
        $scope.videoModal = modal;
    });

    //Define a modal from the choices template
    $ionicModal.fromTemplateUrl('templates/choices.html', {
        scope: $scope,
    }).then(function(modal) {
        $scope.choicesModal = modal;
    });

    $scope.hideChoices = function() {
        $scope.choicesModal.hide();
        $scope.choiceArray = [];
    }

    $rootScope.hideSaveScreen = function() {
        $scope.modal.hide();
        document.location.href = "index.html";
    }

    $scope.getVideoOrder = function(vid) {
        var keywords = vid.keywords,
            orderKey, order = 999;

        orderKey = keywords.filter(function(element) {
            return element.match(/^\{\d+\}$/) !== null;
        });
        if (orderKey.length > 0) {
            order = parseInt(orderKey[0].slice(1, -1), 10);
        }
        return order;
    }

    //Open the saved modal
    $scope.show = function(t) {
        $scope.choiceArray = [];
        t = localStorageService.get("word:" + t);
        if (t == undefined)
            return;
        if (t.toString() != "") {
            try {
				console.log(t);
                t = t.replaceAll("\n", "");
                t = JSON.parse(t);
            } catch (e) {}
            if (t.length == 1) {
                $scope.displayVideo(t[0]);
            } else if (JSON.stringify(t)[0] == "{") {
                $scope.displayVideo(t);
            } else {
                for (var i = 0; i < t.length; i++) {
                    var temp = JSON.stringify(t[i].keywords);
                    var choice = {
                        data: t[i],
                        title: temp
                    }
                    $scope.choiceArray.push(choice);
                }
                $scope.choiceArray.sort(function(a, b) {
                    return $scope.getVideoOrder(a.data) - $scope.getVideoOrder(b.data);
                });
                $scope.choicesModal.show();
            }
        }
    }

    $scope.displayVideo = function(t) {
        $scope.name = JSON.stringify(t.title).replaceAll(",", ", ").replaceAll("\"", "");
        $scope.id = t.id;
        $scope.videoModal.show();
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
            url: 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyA44Dt71cwwDYIlljzVbxEhWMv_3e2Nl5k   ',
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
            console.log("Google failed");
            var msg = JSON.stringify(response);
            console.log(msg.substring(0, 2000));
            $scope.format("", false);
        });

    }

    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };

    //Query the CATS database for a phrase
    $scope.youtube = function(query, raw, ind) {
        var url = 'https://dictionary-smartsign.rhcloud.com/videos?keywords=' + query.replaceAll("#", "");
        var videoObj = {
            name: raw,
            clean: query,
            index: ind,
            color: "button-positive"
        };

        if (query != "") {
            $http.jsonp(url + "&callback=JSON_CALLBACK").success(function(data) {
				data = data.data;
                if (data[0] != undefined) {
                    data[0].keywords.toString().replaceAll(",", ", ");
                    $rootScope.entry.terms.push(videoObj);
                    localStorageService.set('word:' + query, data);
                } else {
                    videoObj.color = "";
                    $rootScope.entry.terms.push(videoObj);
                }
                $scope.phrasesParsed = $scope.phrasesParsed + 1;
                $rootScope.progress = $scope.phrasesParsed;
                $rootScope.progressTotal = $scope.totalPhrases;
                if ($scope.phrasesParsed == $scope.totalPhrases) {
                    $scope.finish(true);
                    $rootScope.progress = '?';
                    $rootScope.progressTotal = '?';
                }
            });
        } else {
            $scope.phrasesParsed = $scope.phrasesParsed + 1;
            if ($scope.phrasesParsed == $scope.totalPhrases) {
                $scope.finish(true);
                $rootScope.progress = '?';
                $rootScope.progressTotal = '?';
            }
        }
    }

    $scope.format = function(tags, success) {

        if (!success) {
            $scope.unloading();
            $scope.showAlert();
            return;
        }

        while (tags.indexOf('\\' + '\"') != -1) {
            tags = tags.replace('\\' + '\"', '\"');
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
                    .replaceAll("'d", "")
                    .replaceAll("'D", "")
                    .replaceAll("'s", "")
                    .replaceAll("'S", "")
                    .replaceAll(".", "")
                    .replaceAll(",", "")
                    .replaceAll(":", "")
                    .replaceAll(";", "")
                    .replaceAll("?", "")
                    .replaceAll("!", "")
                    .replaceAll("_", "")
                    .replaceAll("&", "")
                    .replaceAll("\\", "")
                    .replaceAll("/", "")
                    .replaceAll("\"", "")
                    .toLowerCase();

                $scope.youtube(temp, arr[i], i);
            }
    }

    //Show loading screen
    $scope.loading = function() {
        $ionicLoading.show({
            template: '<div controller="cameraCtrl"> Loading...' + '<br><ion-spinner icon="bubbles" style="stroke:#1097EB;fill:#1097EB;"></ion-spinner><br>{{progress}} of {{progressTotal}}</div>'
        });
    };

    //Show unloading screen
    $scope.unloading = function() {
        $ionicLoading.hide();
    };

    //Comparator
    $scope.compare = function(a, b) {
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
        $ionicModal.fromTemplateUrl('templates/saveToSignBook.html', {
            scope: $scope,
            hardwareBackButtonClose: false
        }).then(function(modal) {
            $scope.modal = modal;
            if (success)
                $scope.modal.show();
        });
    }

    //Show error
    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Failed',
            template: 'Could not read any text. Open the camera and try again.'
        });
    };

})

.controller('videoCtrl', function($scope, $rootScope, $sce) {

    //Returns a validated url to the youtube video
    $scope.getUrl = function() {
        $scope.url = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + $scope.id + '?rel=0&amp;showinfo=0');
        console.log('https://www.youtube.com/embed/' + $scope.id + '?rel=0&amp;showinfo=0');
        return $scope.url;
    }

    $scope.prettify = function(t) {
        return t.replaceAll(",", ", ");
    }
})

.controller('libraryCtrl', function($scope, $rootScope, $ionicPopup, localStorageService) {

    $rootScope.library = [];
    $rootScope.libraryTrash = false;
    $rootScope.libraryStack = false;

    //ng-init of library popup modal
    $scope.getLibrary = function() {
        if (localStorageService.get('library')) {
            $rootScope.library = localStorageService.get('library');
        } else {
            $rootScope.library = ['Default Book'];
        }
    }

    //Hide library modal
    $scope.hideLibrary = function() {
        $scope.libraryModal.remove();
    }

    $scope.bookListing = function(b) {
        b = $rootScope.library[b];
        var temp = $rootScope.safeGet(b);
        if (!temp) {
            return b + " (0 pages)"
        }
        return b + " (" + temp.length + " pages)"
    };

    $scope.doClick = function(e) {
        e = $rootScope.library[e];
        if ($rootScope.libraryTitle == "My Library") {
            $rootScope.currentBook = e;
            localStorageService.set("currentBook", e);
            $scope.hideLibrary();
            $rootScope.getEntries();
        }
        if ($rootScope.libraryTitle == "Save to which book?") {
            $rootScope.currentBook = e;
            localStorageService.set("currentBook", e);
            $rootScope.getEntries();
            $rootScope.addAndSave();
            $scope.hideLibrary();
            $rootScope.hideSaveScreen();
        } else if ($rootScope.libraryTitle == "Move to which book?") {
            var temp = $rootScope.safeGet(e);
            if (!temp) {
                temp = [];
            }
            var count = $rootScope.entries.length;
            var toRemove = [];
            for (var i = 0; i < count; i++) {
                var t = $rootScope.entries[i];
                if (t.selected) {
                    t.selected = false;
                    temp.push(t);
                    toRemove.push(t);
                }
            }
            //Case: Moves to current directory
            if ($rootScope.currentBook == e) {
                $scope.toggleMove();
                $scope.hideLibrary();
            } else {
                $rootScope.safeSet(e, temp);
                for (var i = 0; i < toRemove.length; i++) {
                    $rootScope.entries.splice($rootScope.entries.indexOf(toRemove[i]), 1);
                }
                $rootScope.safeSet($rootScope.currentBook, $rootScope.entries);
                $rootScope.currentBook = e;
                localStorageService.set("currentBook", e);
                $scope.toggleMove();
                $rootScope.getEntries();
                $scope.hideLibrary();
            }
        }
    }

    $scope.doDelete = function() {
        $rootScope.libraryTrash = !$rootScope.libraryTrash;
        $rootScope.libraryStack = false;
        $rootScope.colorReorder(false);
        $rootScope.colorTrash($rootScope.libraryTrash);
    }

    $scope.doReorder = function() {
        $rootScope.libraryStack = !$rootScope.libraryStack;
        $rootScope.libraryTrash = false;
        $rootScope.colorTrash(false);
        $rootScope.colorReorder($rootScope.libraryStack);
    }

    $scope.getBookIcon = function(e) {
        e = $rootScope.library[e];
        if (e == $rootScope.currentBook) {
            return 'icon ion-ios-book';
        } else {
            return 'icon ion-ios-book-outline';
        }
    }

    $scope.doDelete2 = function(e) {
        //Show error if deleting default book or, while in Move mode, attempting
        //to delete the folder you are moving a page from.
        if ($rootScope.library[e] != "Default Book" &&
            !($rootScope.libraryTitle == "Move to which book?" &&
                $rootScope.library[e] == $rootScope.currentBook)) {
            var toDelete = $rootScope.library[e];
            $rootScope.library.splice(e, 1);
            localStorageService.set('library', $rootScope.library);
            $rootScope.safeRemove(toDelete);
            if ($rootScope.currentBook == toDelete) {
                localStorageService.set("currentBook", "Default Book");
                $rootScope.currentBook = "Default Book";
                $rootScope.getEntries();
            }
        } else {
            $scope.refuseDelete();
        }
    }

    //Show error
    $scope.refuseDelete = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Failed',
            template: 'I can\'t delete this right now.'
        });
    };

    $scope.moveLibrary = function(item, fromIndex, toIndex) {
        $rootScope.library.splice(fromIndex, 1);
        $rootScope.library.splice(toIndex, 0, item);
        localStorageService.set('library', $rootScope.library);
    };

    $scope.doAdd = function() {
        var promptPopup = $ionicPopup.prompt({
            title: 'New Book',
            template: 'Give your new book a name.'
        });

        promptPopup.then(function(res) {
            if (res) {
                if ($rootScope.library.indexOf(res) == -1) {
                    $rootScope.library.push(res);
                    localStorageService.set('library', $rootScope.library);
                }
            } else {
                console.log('No input, no book created');
            }
        });
    };
})
