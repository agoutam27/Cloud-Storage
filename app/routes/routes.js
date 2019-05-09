import express from 'express';
import { StorageController } from '../controllers/';

let router = express.Router();

router
 .get('/folders/content', StorageController.getFolderContent)
 .get('/files', StorageController.getFile)
 .post('/files', StorageController.uploadFile);

export default router;