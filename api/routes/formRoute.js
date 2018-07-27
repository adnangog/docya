const express = require('express');
const router = express.Router();
const controller = require('../controlllers/formController')

// router.post('/', controller.tagList);
router.post('/add', controller.formAdd);
// router.patch('/:tagId', controller.tagUpdate);
// router.get('/:tagId', controller.tagGet);
// router.delete('/:tagId', controller.tagDelete);

module.exports = router;