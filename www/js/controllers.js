angular.module('app.controllers', [])

.controller('signBookCtrl', function($scope, $rootScope, $ionicModal, localStorageService) {

    $rootScope.entry = {
        img: '',
        terms: [
            ['', ''],
        ]
    };
    $rootScope.currentBook = "Default Book";

    $scope.getTitle = function() {
        if ($rootScope.currentBook == "Default Book") {
            return "SMARTSign Magic"
        } else {
            return $rootScope.currentBook;
        }
    }

    $rootScope.colorTrash = function(bool) {
        var b = angular.element(document.querySelector('#libraryTrash'));
        if (bool) {
            b.addClass('button-assertive');
            console.log("Trash colored red");
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

    $scope.smartPrint = function(t, i) {
        if (i < 21) {
            return t;
        } else if (i == 21) {
            return "..."
        } else {
            return "";
        }
    }

    //Define a modal from the signBookEntry template
    $ionicModal.fromTemplateUrl('templates/signBookEntry.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    //Define a modal from the library template


    //Display the stored modal
    $scope.show = function(e) {
        $scope.entry = $rootScope.entries[e];
        $scope.modal.show();
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
        console.log($scope.moveOn)
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
        if (t == undefined)
            return;
        if (t.toString() != "") {
            try {
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
        $scope.name = JSON.stringify(t.title).replaceAll(",", ", ").replaceAll("\"", "")
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
        if (query != "") {
            $http.jsonp(url + "&callback=JSON_CALLBACK").success(function(data) {
                try {
                    var videoObj = {
                        name: raw,
                        jsonArray: data,
                        //videoTitle: data[0].keywords.toString().replaceAll(",",", "),
                        index: ind,
                        color: "button-positive"
                    };
                    //Force an error if no response
                    data[0].keywords.toString().replaceAll(",", ", ");
                    $rootScope.entry.terms.push(videoObj);
                    console.log("Accepted " + query + ": " + data[0].keywords);
                } catch (e) {
                    var videoObj = {
                        name: raw,
                        jsonArray: "",
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
                jsonArray: [],
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

        if (!success) {
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
                    .replace("_", "")
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

.controller('videoCtrl', function($scope, $rootScope, $sce) {

    //Returns a validated url to the youtube video
    $scope.getUrl = function() {
        $scope.url = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + $scope.id + '?rel=0&amp;showinfo=0');
        return $scope.url;
    }
})

.controller('libraryCtrl', function($scope, $rootScope, $ionicPopup, localStorageService) {

    $rootScope.currentBook = "Default Book";
    $rootScope.libraryTitle = "My Library"
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
            $scope.hideLibrary();
            $rootScope.getEntries();
        }
        if ($rootScope.libraryTitle == "Save to which book?") {
            $rootScope.currentBook = e;
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
