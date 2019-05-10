'use strict';

(function () {
    angular
        .module('cloudStorageApp')
        .controller('InstanceCtrl', ['$rootScope', '$scope', '$http', '$state', 'URL', instanceCtrl]);

        function instanceCtrl($rootScope, $scope, $http, $state, URL) {
            var vm = this;
            vm.instanceList = [];
            vm.selectedInstance = 0;

            getInstanceList();

            function getInstanceList() {
                // TODO: Move this param to some utility service and fetch when needed
                var options = {
                    url: `${URL.BASE_URL}${URL.API_V_URL}${URL.INSTANCE_URL}`,
                    method: 'GET',
                    params: {
                        hydrate: false
                    },
                    headers: {
                        authorization: `User ${$rootScope.userToken}, Organization ${$rootScope.orgToken}`
                        // authorization: 'User 3uOjRhMp+fXCSOY8Qzo82zfRFuPW1/JIjo4l2S9b+NQ=, Organization 58b4f6b5bf0d8532623b9710a8a88493'
                    }
                };
                $http(options)
                    .then(function (res) {
                        
                        if(!res.data) {
                            throw new Error("No data");
                        }
                        vm.instanceList = res.data;
                    })
                    .catch(function (err) {
                        vm.instanceList = null;
                        if(+err.status === 401) {
                            $state.go('login', {errorMsg: 'Incorrect user or organization tokens'});
                        }
                    });
            }

            vm.openInstanceFolders = function(selectedInstanceId) {

                if(!vm.instanceList || !vm.instanceList.length) {
                    return;
                }
                var selectedInstance = vm.instanceList.find(function(instance) {
                    return instance.id === selectedInstanceId;
                });
                $rootScope.instanceToken = selectedInstance.token;
                $state.go('main.contents', {instance: selectedInstance.element.name, path: ''});

            }
        }
})();