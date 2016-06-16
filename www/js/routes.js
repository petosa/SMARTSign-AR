angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



   .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    controller: 'signBookCtrl',
    abstract:true
  })

  .state('tabsController.signBook', {
    url: '/signbook',
    views: {
      'tab3': {
        templateUrl: 'templates/signBook.html',
        controller: 'signBookCtrl'
      }
    }
  })

  .state('tabsController.camera', {
    url: '/camera',
    views: {
      'tab1': {
        templateUrl: 'templates/camera.html',
        controller: 'cameraCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/page1/signbook')



});
