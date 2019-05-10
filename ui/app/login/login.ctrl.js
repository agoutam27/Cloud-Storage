'user strict';

(function () {

    angular
        .module('cloudStorageApp')
        .controller('LoginCtrl', ['$rootScope', '$scope', '$state', loginCtrl]);

        function loginCtrl($rootScope, $scope, $state) {
            var vm = this;
            
            vm.userToken = vm.orgToken = null;
            vm.errorMsg = $state.errorMsg;

            vm.browse = function () {
                $rootScope.userToken = vm.userToken;
                $rootScope.orgToken = vm.userToken;
                $state.go('main');
            }
        }

})();