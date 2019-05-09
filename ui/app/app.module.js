'use strict';

// Define the `cloudStorageApp` module
var myApp = angular.module('cloudStorageApp', [
    'ui.router'
]);

myApp.run(['$state', '$stateParams', function($state, $stateParams) {

}]);


myApp.config(function($locationProvider, $stateProvider) {

    $locationProvider.html5Mode(true);

    $stateProvider
        .state('main', {
            url: '/instances',
            templateUrl: '/instance-list/instanceListing.html',
            // controller: 'InstanceCtrl'
        })
        .state('main.contents', {
            url: '/:instance/:path',
            templateUrl: '/content-list/contentListing.html',
            // controller: 'ContentListingCtrl'
        });
    
  });