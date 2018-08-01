const express = require('express');
const router = express.Router();
const controller = require('../controlllers/formController')

router.post('/', controller.formList);
router.post('/add', controller.formAdd);
router.patch('/:tagId', controller.formUpdate);
router.get('/:tagId', controller.formGet);
router.delete('/:tagId', controller.formDelete);

module.exports = router;