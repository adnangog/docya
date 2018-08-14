const express = require('express');
const router = express.Router();
const controller = require('../controllers/folderController')

router.post('/', controller.folderList);
router.post('/add', controller.folderAdd);
router.patch('/:folderId', controller.folderUpdate);
router.get('/card/:cardId', controller.foldersByCardId);
router.get('/:folderId', controller.folderGet);
router.delete('/:folderId', controller.folderDelete);

module.exports = router;