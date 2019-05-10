'use strict';
(function () {

    // Define the `cloudStorageApp` module
    var myApp = angular.module('cloudStorageApp', [
        'ui.router',
        'ngCookies'
    ]);
    
    myApp.run(['$rootScope', '$state', '$cookies', function($rootScope, $state, $cookies) {

        if(!$rootScope.userToken || !$rootScope.orgToken) {

            var userToken = $cookies.get('userToken'),
                orgToken = $cookies.get('orgToken');

            if(!userToken || !orgToken) {
                $state.go('login');
                return;
            }
            $rootScope.userToken = userToken;
            $rootScope.orgToken = orgToken;
        }
        $state.go('main');
    
    }]);
    
    
    myApp.config(function($locationProvider, $stateProvider) {
    
        $locationProvider.html5Mode(true);
    
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: '/login/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'vm',
                params: { errorMsg: null }
            })
            .state('main', {
                url: '/instances',
                templateUrl: '/instance-list/instanceListing.html',
                controller: 'InstanceCtrl',
                controllerAs: 'vm'
            })
            .state('main.contents', {
                url: '/:instance/:path',
                templateUrl: '/content-list/contentListing.html',
                controller: 'ContentListingCtrl',
                controllerAs: 'vm',
                params: {instanceId: 0},
                cache: false
            });
        
      });

})();