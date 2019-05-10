'use strict';
(function () {

    // Define the `cloudStorageApp` module
    var myApp = angular.module('cloudStorageApp', [
        'ui.router'
    ]);
    
    myApp.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {

        if(!$rootScope.userToken || !$rootScope.orgToken) {
            $state.go('login');
            return;
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
                cache: false
            });
        
      });

})();