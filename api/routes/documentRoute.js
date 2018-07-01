const express = require('express');
const router = express.Router();
const controller = require('../controlllers/documentController')

router.get('/', controller.documentList);
router.post('/', controller.documentAdd);
router.patch('/:documentId', controller.documentUpdate);
router.get('/:documentId', controller.documentGet);
router.delete('/:documentId', controller.documentDelete);
router.get('/type/', controller.documentTypeList);
router.post('/type/', controller.documentTypeAdd);
router.patch('/type/:typeId', controller.documentTypeUpdate);
router.get('/type/:typeId', controller.documentTypeGet);
router.delete('/type/:typeId', controller.documentTypeDelete);

module.exports = router;