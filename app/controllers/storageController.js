import request from 'request';
import requestHelper from '../../lib/requestHelper';
import ENDPOINT from './../Constants/endpoints';
import responder from '../../lib/expressResponder';
import errorHandler from '../handlers/errorHandler';
import logger from './../../lib/logger';
import multiparty from 'multiparty';

const form = new multiparty.Form();
const BASE_URL = ENDPOINT.BASE_URL + ENDPOINT.URL_SEPARATOR + ENDPOINT.COMP_URL;

const rqComp = new requestHelper(BASE_URL);

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

        request(rqComp.getParams(ENDPOINT.FOLDER_CONTENTS, queryParams, headers)).pipe(res);
        
        // request.get(ENDPOINT.FOLDER_CONTENTS, queryParams, headers)
        //     .then(result => {
        //         logger.debug(`Response from ${ENDPOINT.FOLDER_CONTENTS}`, result);
        //         responder.success(res, result);
        //     })
        //     .catch(error => {
        //         logger.error(`Error from ${ENDPOINT.FOLDER_CONTENTS}`, error);
        //         responder.operationFailed(res, error);
        //     })
        
    }

    static getFile(req, res, next) {
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
        }

        request(rqComp.getParams(ENDPOINT.FILES, queryParams, headers)).pipe(res);
    }

    static uploadFile(req, res, next) {
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
            Authorization: req.headers.authorization,
            'Content-type': 'multipart/form-data'
        }

        const queryParams = {
            path: req.query.path,
            chunkedUpload: req.query.chunkedUpload
        }
        form.parse(req, (err, fields, file) => {
            logger.debug(`Request body = `, file);
            request(rqComp.postParams(ENDPOINT.FILES, , queryParams, headers),
            (err, result, body) => {
                // logger.debug("-------", err, result, body);
                responder.success(res, 'dine')
            });
        })

    }

}

export default StorageController;