const express = require('express');
const router = express.Router();
const controller = require('../controlllers/tagController')

router.get('/', controller.tagList);
router.post('/', controller.tagAdd);
router.patch('/:tagId', controller.tagUpdate);
router.get('/:tagId', controller.tagGet);
router.delete('/:tagId', controller.tagDelete);

module.exports = router;