const express = require('express');
const router = express.Router();
const controller = require('../controlllers/folderController')

router.get('/', controller.folderList);
router.post('/', controller.folderAdd);
router.patch('/:folderId', controller.folderUpdate);
router.get('/:folderId', controller.folderGet);
router.delete('/:folderId', controller.folderDelete);

module.exports = router;