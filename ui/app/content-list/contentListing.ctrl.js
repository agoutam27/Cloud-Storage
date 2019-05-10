'use strict';

(function () {
    angular
        .module('cloudStorageApp')
        .controller('ContentListingCtrl', ['$rootScope', '$scope', '$http', '$state', 'URL', contentListCtrl]);

        function contentListCtrl($rootScope, $scope, $http, $state, URL) {
            var vm = this;

            vm.contentList = [];
            vm.file = null;

            getFolderContent();

            $scope.$watch('vm.file', function (newVal , oldVal) {
                if(newVal) {
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
                    params: {path: $state.params.path || '/'},
                    headers: {
                        'Content-Type' : undefined, // important to upload file , browser will automatically set it
                        authorization: `User ${$rootScope.userToken}, Organization ${$rootScope.orgToken}, Element ${$rootScope.instanceToken}`                       
                        // authorization: 'User 3uOjRhMp+fXCSOY8Qzo82zfRFuPW1/JIjo4l2S9b+NQ=, Organization 58b4f6b5bf0d8532623b9710a8a88493, Element ' + $rootScope.instanceToken
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
                var param = {
                    url: URL.SERVER_BASE_URL + URL.FOLDER_CONTENT,
                    params: {path: $state.params.path || '/'},
                    method: 'GET',
                    headers: {
                        authorization: `User ${$rootScope.userToken}, Organization ${$rootScope.orgToken}, Element ${$rootScope.instanceToken}`
                    }
                }
                $http(param)
                    .then(function (res) {
                        if(!res.data) {
                            throw new Error('No data');
                        }
                        vm.contentList = res.data;
                    })
                    .catch(function (err) {
                        console.log(err);
                        if(+err.status === 401) {
                            $state.go('login', {errorMsg: 'Incorrect user or organization tokens'});
                        }
                    });
            }

            function downloadFile(path, mimeType) {
                if(!path || path === '/') return;
                var param = {
                    url: URL.SERVER_BASE_URL + URL.FILES,
                    params: {path: path},
                    method: 'GET',
                    headers: {
                        authorization: 'User 3uOjRhMp+fXCSOY8Qzo82zfRFuPW1/JIjo4l2S9b+NQ=, Organization 58b4f6b5bf0d8532623b9710a8a88493, Element ' + $rootScope.instanceToken
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

            vm.getClass = function(contentObj) {
                
                if(contentObj.directory) return 'oi-folder';
                return 'oi-document';

                // switch(contentObj.properties.mimeType) {
                //     case 'image/png' :
                //         return 
                // }
            }

            vm.open = function(contentObj) {
                if(contentObj.directory) {
                    // $state.go('main.content', {path: contentObj.path, instance: $state.params.instance}, {reload: true});
                    // $state.reload();
                    $state.transitionTo($state.current, {path: decodeURI(contentObj.path), instance: $state.params.instance}, { reload: true, inherit: true, notify: true });
                    return;
                }
                downloadFile(contentObj.path, contentObj.properties.mimeType);
            }
        }

})();