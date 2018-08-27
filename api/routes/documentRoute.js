const express = require('express');
const router = express.Router();
const controller = require('../controllers/documentController')

router.get('/version/:documentId', controller.versionsByDocumentId);
router.post('/type', controller.documentTypeList);
router.post('/type/add', controller.documentTypeAdd);
router.patch('/type/:typeId', controller.documentTypeUpdate);
router.get('/type/:typeId', controller.documentTypeGet);
router.get('/type/delete/:typeId', controller.documentTypeDelete);
router.post('/', controller.documentList);
router.post('/add', controller.documentAdd);
router.post('/adds', controller.documentAdds);
router.patch('/:documentId', controller.documentUpdate);
router.get('/:documentId', controller.documentGet);
router.get('/delete/:documentId', controller.documentDelete);

module.exports = router;