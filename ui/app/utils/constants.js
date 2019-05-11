'use strict';

(function () {

    angular
        .module('cloudStorageApp')
        .constant('URL', {
            'BASE_URL': 'https://staging.cloud-elements.com',
            'SERVER_BASE_URL': 'http://localhost:3000/v1',
            'API_V_URL': '/elements/api-v2',
            'INSTANCE_URL': '/instances',
            'FOLDER_CONTENT': '/folders/content',
            'FILES': '/files'
        });

})();