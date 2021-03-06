'use strict';

(function () {
    angular
        .module('cloudStorageApp')
        .controller('ContentListingCtrl', ['$rootScope', '$scope', '$http', '$state', 'URL', contentListCtrl]);

    function contentListCtrl($rootScope, $scope, $http, $state, URL) {
        var vm = this;

        vm.contentList = null;
        vm.file = null;
        vm.dragAndDrop = false;
        vm.uploadMsg = null;
        vm.breadcrumbItems = [$state.params.instance];

        $scope.$parent.vm.selectedInstance = $state.params.instanceId;

        createBreadCrumb($state.params.path);
        getFolderContent();

        $scope.$watch('vm.file', function (newVal, oldVal) {
            if (newVal) {
                uploadFile();
            }
        });

        function createBreadCrumb(path) {
            if(path) {
                var arr = path.split('/');
                vm.breadcrumbItems = vm.breadcrumbItems.concat(arr[0] ? arr : arr.splice(1));
            }
        }

        function uploadFile() {
            // TODO: Move these option to utility service and fetch when needed
            vm.uploadMsg = "File upload in progress";
            vm.uploadInfoCls = "alert-primary show";
            var formData = new FormData();
            formData.append('file', vm.file);
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
            vm.file = null;

            $http(options)
                .then(function (res) {
                    console.log(res);
                    vm.uploadMsg = "File Upload Successfull";
                    vm.uploadInfoCls = "alert-success fade";

                })
                .catch(function (err) {
                    vm.uploadMsg = "File Upload Unsuccessful";
                    vm.uploadInfoCls = "alert-danger my-fade";
                });
        }

        function getFolderContent() {
            $scope.$parent.vm.throbber = true;
            vm.contentList = null;
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
                    try {
                        $scope.$digest();
                    } catch(err) {
                        console.log('Digest in progress');
                    }
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

        vm.goToPath = function (index) {
            vm.breadcrumbItems = vm.breadcrumbItems.splice(0, index+1);
            var pathStr = index === 0 ? "" : vm.breadcrumbItems.join("/");
            $state.transitionTo($state.current, {
                path: pathStr,
                instance: $state.params.instance,
                instanceId: $state.params.instanceId
            }, {
                reload: true,
                inherit: true,
                notify: true
            });
            return;
        }
    }

})();