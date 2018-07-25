const express = require('express');
const router = express.Router();
const controller = require('../controlllers/documentController')

router.post('/type', controller.documentTypeList);
router.post('/type/add', controller.documentTypeAdd);
router.patch('/type/:typeId', controller.documentTypeUpdate);
router.get('/type/:typeId', controller.documentTypeGet);
router.delete('/type/:typeId', controller.documentTypeDelete);
router.post('/', controller.documentList);
router.post('/add', controller.documentAdd);
router.patch('/:documentId', controller.documentUpdate);
router.get('/:documentId', controller.documentGet);
router.delete('/:documentId', controller.documentDelete);

module.exports = router;