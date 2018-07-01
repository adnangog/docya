const express = require('express');
const router = express.Router();
const controller = require('../controlllers/categoryController')

router.get('/', controller.categoryList);
router.post('/', controller.categoryAdd);
router.patch('/:categoryId', controller.categoryUpdate);
router.get('/:categoryId', controller.categoryGet);
router.delete('/:categoryId', controller.categoryDelete);

module.exports = router;