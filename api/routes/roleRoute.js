const express = require('express');
const router = express.Router();
const controller = require('../controllers/roleController')

router.post('/', controller.roleList);
router.post('/add', controller.roleAdd);
router.patch('/:roleId', controller.roleUpdate);
router.get('/:roleId', controller.roleGet);
router.delete('/:roleId', controller.roleDelete);

module.exports = router;