'use strict';

(function () {
    angular
        .module('cloudStorageApp')
        .controller('ContentListingCtrl', ['$rootScope', '$scope', '$http', '$state', 'URL', contentListCtrl]);

        function contentListCtrl($rootScope, $scope, $http, $state, URL) {
            var vm = this;

            vm.contentList = [];

            getFolderContent();

            function getFolderContent() {
                var param = {
                    url: URL.SERVER_BASE_URL + URL.FOLDER_CONTENT,
                    params: {path: $state.path || '/'},
                    method: 'GET',
                    headers: {
                        authorization: 'User 3uOjRhMp+fXCSOY8Qzo82zfRFuPW1/JIjo4l2S9b+NQ=, Organization 58b4f6b5bf0d8532623b9710a8a88493, Element ' + $rootScope.instanceToken
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
                    });
            }
        }

})();