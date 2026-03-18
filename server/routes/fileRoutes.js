import express from 'express';
import { getFiles, createItem, deleteItem, getOnlyOfficeConfig, saveOnlyOfficeFile, renameItem, moveItem, upload, uploadFile, saveContent, getItem, getAudioFiles } from '../controllers/fileController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/:parentId?', getFiles);
router.get('/item/:id', getItem);
router.get('/audio/list', getAudioFiles);
router.post('/', createItem);
router.post('/upload', upload.single('file'), uploadFile);
router.delete('/:id', deleteItem);
router.patch('/:id/move', moveItem);
router.get('/:id/open', getOnlyOfficeConfig);
router.post('/:id/save', saveOnlyOfficeFile);
router.put('/:id', renameItem);
router.put('/:id/content', saveContent);

export default router;
