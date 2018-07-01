const express = require('express');
const router = express.Router();
const controller = require('../controlllers/roleController')

router.get('/', controller.roleList);
router.post('/', controller.roleAdd);
router.patch('/:roleId', controller.roleUpdate);
router.get('/:roleId', controller.roleGet);
router.delete('/:roleId', controller.roleDelete);

module.exports = router;