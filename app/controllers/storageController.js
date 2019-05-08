import requestClass from '../../lib/request';
import * as ENDPOINT from './../Constants/endpoints';
import responder from '../../lib/expressResponder';
import errorHandler from '../handlers/errorHandler';
import logger from './../../lib/logger';

const BASE_URL = ENDPOINT.BASE_URL + ENDPOINT.COMP_URL;
const DEFAULT_HEADERS = {
    'Content-type': 'application/json'
}
const request = new requestClass(BASE_URL, DEFAULT_HEADERS);

class StorageController {

    static getFolderContent(req, res, next) {

        if(!req.headers.authorization) {
            logger.debug(`\n\nHeaders`, req.headers);
            errorHandler.sendError(res, 401);
            return;
        }

        if(!req.query.path) {
            responder.operationFailed(res, "unspecified path");
            return;
        }

        const headers = {
            Authorization: req.headers.authorization
        }

        const queryParams = {
            path: req.query.path,
            pageSize: req.query.pageSize,
            orderBy: req.query.orderBy
        }
        
        request.get(ENDPOINT.FOLDER_CONTENTS, queryParams, headers)
            .then(result => {
                logger.debug(`Response from ${ENDPOINT.FOLDER_CONTENTS}`, result);
                responder.success(res, result);
            })
            .catch(error => {
                logger.error(`Error from ${ENDPOINT.FOLDER_CONTENTS}`, error);
                responder.operationFailed(res, error);
            })
        
    }

}

export default StorageController;