'user strict';

(function () {

    angular
        .module('cloudStorageApp')
        .controller('LoginCtrl', ['$rootScope', '$scope', '$state', '$cookies', loginCtrl]);

        function loginCtrl($rootScope, $scope, $state, $cookies) {
            var vm = this;
            
            vm.userToken = vm.orgToken = null;
            vm.errorMsg = $state.errorMsg;

            vm.browse = function () {
                $rootScope.userToken = vm.userToken;
                $rootScope.orgToken = vm.orgToken;
                $cookies.put('userToken', vm.userToken);
                $cookies.put('orgToken', vm.orgToken);
                $state.go('main');
            }
        }

})();