const express = require('express');
const router = express.Router();
const controller = require('../controlllers/userController')

router.get('/', controller.userList);
router.post('/', controller.userAdd);
router.patch('/:userId', controller.userUpdate);
router.get('/:userId', controller.userGet);
router.delete('/:userId', controller.userDelete);

module.exports = router;