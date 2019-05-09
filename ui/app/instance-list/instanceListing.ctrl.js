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
                var options = {
                    url: `${URL.BASE_URL}${URL.API_V_URL}${URL.INSTANCE_URL}`,
                    method: 'GET',
                    params: {
                        hydrate: false
                    },
                    headers: {
                        authorization: 'User 3uOjRhMp+fXCSOY8Qzo82zfRFuPW1/JIjo4l2S9b+NQ=, Organization 58b4f6b5bf0d8532623b9710a8a88493'
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