'use strict';

(function () {
    angular
        .module('cloudStorageApp')
        .controller('ContentListingCtrl', ['$rootScope', '$scope', '$http', '$state', 'URL', contentListCtrl]);

    function contentListCtrl($rootScope, $scope, $http, $state, URL) {
        var vm = this;

        vm.contentList = [];
        vm.file = null;
        vm.dragAndDrop = false;
        $scope.$parent.vm.selectedInstance = $state.params.instanceId;

        getFolderContent();

        $scope.$watch('vm.file', function (newVal, oldVal) {
            if (newVal) {
                uploadFile(newVal);
            }
        });

        function uploadFile(file) {
            // TODO: Move these option to utility service and fetch when needed
            var formData = new FormData();
            formData.append('file', file);
            var options = {
                method: 'POST',
                url: URL.SERVER_BASE_URL + URL.FILES,
                params: {
                    path: $state.params.path || '/'
                },
                headers: {
                    'Content-Type': undefined, // important to upload file , browser will automatically set it
                    authorization: `User ${$rootScope.userToken}, Organization ${$rootScope.orgToken}, Element ${$rootScope.instanceToken}`
                },
                data: formData
            }

            $http(options)
                .then(function (res) {
                    console.log(res);
                })
                .catch(console.error);
        }

        function getFolderContent() {
            $scope.$parent.vm.throbber = true;
            var param = {
                url: URL.SERVER_BASE_URL + URL.FOLDER_CONTENT,
                params: {
                    path: $state.params.path || '/'
                },
                method: 'GET',
                headers: {
                    authorization: `User ${$rootScope.userToken}, Organization ${$rootScope.orgToken}, Element ${$rootScope.instanceToken}`
                }
            }
            $http(param)
                .then(function (res) {
                    if (!res.data) {
                        throw new Error('No data');
                    }
                    vm.contentList = res.data;
                    vm.dragAndDrop = true;
                    $scope.$parent.vm.throbber = false;
                })
                .catch(function (err) {
                    console.log(err);
                    $scope.$parent.vm.throbber = false;
                    if (+err.status === 401) {
                        $state.go('login', {
                            errorMsg: 'Incorrect user or organization tokens'
                        });
                    }
                });
        }

        function downloadFile(path, mimeType) {
            if (!path || path === '/') return;
            var param = {
                url: URL.SERVER_BASE_URL + URL.FILES,
                params: {
                    path: path
                },
                method: 'GET',
                headers: {
                    authorization: `User ${$rootScope.userToken}, Organization ${$rootScope.orgToken}, Element ${$rootScope.instanceToken}`
                }
            }
            $http(param)
                .then(function (res) {
                    download(res.data, path.substring(path.lastIndexOf("/") + 1), mimeType);
                })
                .catch(function (err) {
                    console.log(err);
                });
        }

        vm.getClass = function (contentObj) {

            if (contentObj.directory) return 'oi-folder';
            return 'oi-document';

            // switch(contentObj.properties.mimeType) {
            //     case 'image/png' :
            //         return 
            // }
        }

        vm.open = function (contentObj) {
            if (contentObj.directory) {

                $state.transitionTo($state.current, {
                    path: contentObj.path,
                    instance: $state.params.instance,
                    instanceId: $state.params.instanceId
                }, {
                    reload: true,
                    inherit: true,
                    notify: true
                });
                return;
            }
            downloadFile(contentObj.path, contentObj.properties.mimeType);
        }
    }

})();