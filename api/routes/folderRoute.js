const express = require('express');
const router = express.Router();
const controller = require('../controllers/folderController')

router.post('/', controller.folderList);
router.post('/add', controller.folderAdd);
router.patch('/:folderId', controller.folderUpdate);
router.post('/card/:cardId', controller.foldersByCardId);
router.get('/:folderId', controller.folderGet);
router.get('/delete/:folderId', controller.folderDelete);

module.exports = router;