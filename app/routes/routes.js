import express from 'express';
import { StorageController } from '../controllers/';

let router = express.Router();

router
 .get('/folders/content', StorageController.getFolderContent);

export default router;